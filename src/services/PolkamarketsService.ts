/* eslint-disable no-underscore-dangle */
import * as realitioLib from '@reality.eth/reality-eth-lib/formatters/question';
import { features } from 'config';
import environment, { NetworkConfig } from 'config/environment';
import * as polkamarketsjs from 'polkamarkets-js';

export default class PolkamarketsService {
  // polkamarkets app
  public polkamarkets: any;

  // polkamarkets smart contract instances
  public contracts: any = {};

  // indicates if user has already done a successful metamask login
  public loggedIn: boolean = false;

  // user eth address
  public address: string = '';

  public predictionMarketContractAddress: string;

  public erc20ContractAddress: string;

  public realitioErc20ContractAddress: string;

  public achievementsContractAddress: string | undefined;

  public votingContractAddress: string | undefined;

  // util functions
  static bytes32ToInt(bytes32Str: string): number {
    return Number(realitioLib.bytes32ToString(bytes32Str, { type: 'int' }));
  }

  static intToBytes32(int: string): string {
    return realitioLib.answerToBytes32(Number(int), { type: 'int' });
  }

  constructor() {
    this.predictionMarketContractAddress =
      '0x6AA72e36d97F8b5B76C78597b1453A207c9289E5';
    this.erc20ContractAddress = '0x16878fb876D4AA99F86f9778E44a1bdE4f11E3B7';
    this.realitioErc20ContractAddress =
      '0x997f7f87fBCb14308F807fE0Fa885b5F25306C86';
    this.achievementsContractAddress =
      '0x89675c45ad2894Ca0C83Dd2497a812E5E74a6356';
    this.votingContractAddress = '0x7dac4883231Af09A6A4C4819F2F5d9FF21A336cc';

    this.polkamarkets = new polkamarketsjs.Application({
      web3Provider:
        'https://goerli.infura.io/v3/e06345ef5db24fc5b28b483ed432f1ec',
      web3EventsProvider:
        'https://goerli.infura.io/v3/e06345ef5db24fc5b28b483ed432f1ec'
    });

    this.polkamarkets.start();
    // fetching contract
    this.getContracts();
  }

  public async getContracts() {
    this.getPredictionMarketContract();
    this.getRealitioERC20Contract();
    this.getERC20Contract();
    this.getAchievementsContract();
    this.getVotingContract();
  }

  public getPredictionMarketContract() {
    this.contracts.pm = this.polkamarkets.getPredictionMarketV2Contract({
      contractAddress: this.predictionMarketContractAddress
    });
  }

  public getERC20Contract() {
    this.contracts.erc20 = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: this.erc20ContractAddress
    });
  }

  public getRealitioERC20Contract() {
    this.contracts.realitio = this.polkamarkets.getRealitioERC20Contract({
      contractAddress: this.realitioErc20ContractAddress
    });
  }

  public getAchievementsContract() {
    this.contracts.achievements = this.polkamarkets.getAchievementsContract({
      contractAddress: this.achievementsContractAddress
    });
  }

  public getVotingContract() {
    this.contracts.voting = this.polkamarkets.getVotingContract({
      contractAddress: this.votingContractAddress
    });
  }

  // returns wether wallet is connected to service or not
  public async isLoggedIn(): Promise<boolean> {
    return this.polkamarkets.isLoggedIn();
  }

  public async login() {
    if (this.loggedIn) return true;

    try {
      const loggedIn = await this.polkamarkets.login();
      // successful login
      if (loggedIn) {
        const address = await this.getAddress();
        // TODO: set this in polkamarkets
        if (address) {
          this.polkamarkets.web3.eth.defaultAccount = this.address;
          this.loggedIn = true;
          this.address = address;
          // re-fetching contracts
          this.getContracts();
        }
      }
    } catch (e) {
      // should be non-blocking
      return false;
    }

    return this.loggedIn;
  }

  public async getAddress(): Promise<string> {
    if (this.address) return this.address;

    const address = (await this.polkamarkets.getAddress()) || '';

    return address;
  }

  public async getBalance(): Promise<number> {
    if (!this.address) return 0;

    // returns user balance in ETH
    const balance = await this.polkamarkets.getETHBalance();

    return parseFloat(balance) || 0;
  }

  // PredictionMarket contract functions

  public async getMinimumRequiredBalance(): Promise<number> {
    const requiredBalance = await this.contracts.pm.getMinimumRequiredBalance();

    return requiredBalance;
  }

  // eslint-disable-next-line class-methods-use-this
  public async getMarketFee(): Promise<number> {
    // TODO: make it variable
    return 0.02;
  }

  public async createMarket(
    name: string,
    description: string,
    image: string,
    duration: number,
    outcomes: Array<string>,
    category: string,
    value: number,
    odds: Array<number>,
    fee: number,
    token: string = '',
    wrapped: boolean = false,
    treasuryFee: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    let response;
    const args = {
      name,
      description,
      image,
      duration,
      outcomes,
      category,
      value,
      oracleAddress: this.address,
      odds,
      fee: (fee * 1e16).toString(),
      treasuryFee: (treasuryFee * 1e16).toString(),
      treasury: this.address
    };

    if (wrapped) {
      response = await this.contracts.pm.createMarketWithETH(args);
    } else {
      response = await this.contracts.pm.createMarket({
        ...args,
        token
      });
    }

    return response;
  }

  public async buy(
    marketId: string | number,
    outcomeId: string | number,
    value: number,
    minOutcomeSharesToBuy: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.buy({
      marketId,
      outcomeId,
      value,
      minOutcomeSharesToBuy,
      wrapped
    });

    return response;
  }

  public async sell(
    marketId: string | number,
    outcomeId: string | number,
    value: number,
    maxOutcomeSharesToSell: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.sell({
      marketId,
      outcomeId,
      value,
      maxOutcomeSharesToSell,
      wrapped
    });

    return response;
  }

  public async addLiquidity(
    marketId: string | number,
    value: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.addLiquidity({
      marketId,
      value,
      wrapped
    });

    return response;
  }

  public async removeLiquidity(
    marketId: string | number,
    shares: number,
    wrapped: boolean
  ) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.removeLiquidity({
      marketId,
      shares,
      wrapped
    });

    return response;
  }

  public async claimWinnings(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const wrapped = await this.isMarketERC20TokenWrapped(marketId);

    const response = await this.contracts.pm.claimWinnings({
      marketId,
      wrapped
    });

    return response;
  }

  public async claimVoidedOutcomeShares(
    marketId: string | number,
    outcomeId: string | number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const wrapped = await this.isMarketERC20TokenWrapped(marketId);

    const response = await this.contracts.pm.claimVoidedOutcomeShares({
      marketId,
      outcomeId,
      wrapped
    });

    return response;
  }

  public async claimLiquidity(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.claimLiquidity({
      marketId
    });

    return response;
  }

  public async getMarketData(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const marketData = await this.contracts.pm.getMarketData({ marketId });

    marketData.outcomes = await Promise.all(
      marketData.outcomeIds.map(async outcomeId => {
        const outcomeData = await this.contracts.pm.getOutcomeData({
          marketId,
          outcomeId
        });

        return outcomeData;
      })
    );

    return marketData;
  }

  public async getWETHAddress() {
    const wethAddress = await this.contracts.pm.getWETHAddress();

    return wethAddress;
  }

  public async isMarketERC20TokenWrapped(marketId: string | number) {
    const isWrapped = await this.contracts.pm.isMarketERC20TokenWrapped({
      marketId
    });

    return isWrapped;
  }

  public async getMarketPrices(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.getMarketPrices({ marketId });

    return response;
  }

  public async getPortfolio(): Promise<Object> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const response = await this.contracts.pm.getMyPortfolio();

    return response;
  }

  public async getActions(): Promise<any[]> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return [];

    const response = await this.contracts.pm.getMyActions();

    return response;
  }

  public async resolveMarket(marketId: string | number) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.pm.resolveMarketOutcome({
      marketId
    });

    return response;
  }

  // ERC20 contract functions

  public async getPolkBalance(): Promise<number> {
    return this.getERC20Balance(this.erc20ContractAddress);
  }

  public async getERC20Balance(erc20ContractAddress: string): Promise<number> {
    // ensuring user has wallet connected
    await this.login();

    if (!this.address) return 0;

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    // returns user balance in ETH
    const balance = await contract.getTokenAmount(this.address);

    return parseFloat(balance) || 0;
  }

  public async isPolkClaimed(): Promise<boolean> {
    if (!this.address) return false;

    if (features.regular.enabled) return false;

    let claimed;

    try {
      // TODO improve this: ensuring erc20 contract is initialized
      // eslint-disable-next-line no-underscore-dangle
      await this.contracts.erc20.__init__();

      // TODO: only call function when fantasy mode is enabled
      claimed = await this.contracts.erc20.hasUserClaimedTokens({
        address: this.address
      });
    } catch (error) {
      return false;
    }

    return claimed;
  }

  public async claimPolk(): Promise<boolean> {
    // ensuring user has wallet connected
    await this.login();

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await this.contracts.erc20.__init__();

    await this.contracts.erc20.claimAndApproveTokens();

    return true;
  }

  public async getERC20TokenInfo(erc20ContractAddress: string): Promise<any> {
    if (!erc20ContractAddress) return false;

    let token;

    try {
      const contract = this.polkamarkets.getFantasyERC20Contract({
        contractAddress: erc20ContractAddress
      });

      // TODO improve this: ensuring erc20 contract is initialized
      // eslint-disable-next-line no-underscore-dangle
      await contract.__init__();

      token = await contract.getTokenInfo();
    } catch (error) {
      // invalid answer, returning false
      return false;
    }

    return token;
  }

  public async isERC20Approved(
    erc20ContractAddress: string,
    spenderAddress: string
  ): Promise<boolean> {
    // ensuring user has wallet connected
    await this.login();

    if (!this.address || !erc20ContractAddress || !spenderAddress) return false;

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    const isApproved = await contract.isApproved({
      address: this.address,
      amount: 1,
      spenderAddress
    });

    return isApproved;
  }

  public async approveERC20(
    erc20ContractAddress: string,
    spenderAddress: string,
    amount?: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    const contract = this.polkamarkets.getFantasyERC20Contract({
      contractAddress: erc20ContractAddress
    });

    // TODO improve this: ensuring erc20 contract is initialized
    // eslint-disable-next-line no-underscore-dangle
    await contract.__init__();

    const response = await contract.approve({
      address: spenderAddress,
      amount: amount || 2 ** 128 - 1
    });

    return response;
  }

  public async calcBuyAmount(
    marketId: string | number,
    outcomeId: string | number,
    value: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcBuyAmount({
      marketId,
      outcomeId,
      value
    });

    return response;
  }

  public async calcSellAmount(
    marketId: string | number,
    outcomeId: string | number,
    value: number
  ): Promise<number> {
    const response = await this.contracts.pm.calcSellAmount({
      marketId,
      outcomeId,
      value
    });

    return response;
  }

  // Realitio contract functions

  public async isRealitioERC20Approved(): Promise<boolean> {
    return this.isERC20Approved(
      this.erc20ContractAddress,
      this.contracts.realitio.getAddress()
    );
  }

  public async approveRealitioERC20(): Promise<any> {
    return this.approveERC20(
      this.erc20ContractAddress,
      this.contracts.realitio.getAddress()
    );
  }

  public async getQuestionBonds(
    questionId: string,
    user: string | null = null
  ) {
    const bonds = await this.contracts.realitio.getQuestionBondsByAnswer({
      questionId,
      user
    });

    // mapping answer ids to outcome ids
    Object.keys(bonds).forEach(answerId => {
      const outcomeId = Number(
        realitioLib.bytes32ToString(answerId, { type: 'int' })
      );
      bonds[outcomeId] = bonds[answerId];
      delete bonds[answerId];
    });

    return bonds;
  }

  public async placeBond(
    questionId: string,
    outcomeId: string | number,
    amount: number
  ) {
    // ensuring user has wallet connected
    await this.login();

    // translating outcome id to answerId
    const answerId = realitioLib.answerToBytes32(outcomeId, { type: 'int' });

    const response = await this.contracts.realitio.submitAnswerERC20({
      questionId,
      answerId,
      amount
    });

    return response;
  }

  public async claimWinningsAndWithdraw(questionId: string) {
    // ensuring user has wallet connected
    await this.login();

    const response = await this.contracts.realitio.claimWinningsAndWithdraw({
      questionId
    });

    return response;
  }

  public async getBonds(): Promise<Object> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const bonds = await this.contracts.realitio.getMyBonds();

    return bonds;
  }

  public async getBondActions(): Promise<Object> {
    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return [];

    const response = await this.contracts.realitio.getMyActions();

    return response;
  }

  public async getBondMarketIds(): Promise<string[]> {
    // ensuring user has wallet connected
    if (!this.address) return [];

    const questions = await this.contracts.realitio.getMyQuestions();

    const marketIds = await this.contracts.pm.getMarketIdsFromQuestions({
      questions: questions.map(question => question.question)
    });

    return marketIds;
  }

  public async getQuestion(questionId: string): Promise<Object> {
    const question = await this.contracts.realitio.getQuestion({ questionId });

    return question;
  }

  // Achievement contract functions

  public async getAchievements(): Promise<Object> {
    // TODO improve this: contract might not be defined for network
    if (!this.contracts.achievements.getContract()._address) return {};

    // ensuring user has wallet connected
    if (!this.address) return {};

    const response = await this.contracts.achievements.getUserAchievements({
      user: this.address
    });

    return response;
  }

  public async claimAchievement(achievementId: string | number) {
    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.achievements.claimAchievement({
      achievementId
    });

    return response;
  }

  // Voting contract functions

  public async getMinimumVotingRequiredBalance(): Promise<number> {
    if (!this.contracts.voting.getContract()._address) return 0;

    const requiredBalance =
      await this.contracts.voting.getMinimumRequiredBalance();

    return requiredBalance;
  }

  public async getUserVotes(): Promise<Object> {
    // TODO improve this: contract might not be defined for network
    if (!this.contracts.voting.getContract()._address) return {};

    // ensuring user has wallet connected
    await this.login();
    if (!this.address) return {};

    const response = await this.contracts.voting.getUserVotes({
      user: this.address
    });

    return response;
  }

  public async upvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.upvoteItem({ itemId });

    return response;
  }

  public async downvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.downvoteItem({ itemId });

    return response;
  }

  public async removeUpvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.removeUpvoteItem({ itemId });

    return response;
  }

  public async removeDownvoteItem(itemId) {
    // ensuring user has wallet connected
    await this.login();

    // ensuring user has wallet connected
    if (!this.address) return false;

    const response = await this.contracts.voting.removeDownvoteItem({ itemId });

    return response;
  }
}
