import {
  Input,
  OutcomeInput,
  // ProbabilityInput,
  FileUploadInput,
  SelectInput,
  DateInput
} from '../Input';
import Text from '../Text';

function CreateMarketFormConfigure() {
  return (
    <div className="pm-c-create-market-form__card">
      <Text
        as="h5"
        scale="body"
        fontWeight="medium"
        className="pm-c-create-market-form__card-title"
      >
        Configure Market
      </Text>
      <Input
        name="question"
        label="Market Question"
        placeholder="What would you like to see the world predict?"
      />
      <div
        className="pm-c-create-market-form__card-outcome-group--row"
        style={{ gridTemplateColumns: '1fr' }}
      >
        <OutcomeInput
          badgeColor="pink"
          name="firstOutcome.name"
          label="Outcome"
          placeholder="Outcome..."
        />
        {/* <ProbabilityInput name="firstOutcome.probability" label="Probability" /> */}
      </div>
      <div
        className="pm-c-create-market-form__card-outcome-group--row"
        style={{ gridTemplateColumns: '1fr' }}
      >
        <OutcomeInput
          badgeColor="purple"
          name="secondOutcome.name"
          placeholder="Outcome..."
        />
        {/* <ProbabilityInput name="secondOutcome.probability" /> */}
      </div>
      <FileUploadInput
        label="Market Thumbnail"
        name="thumbnail"
        notUploadedActionLabel="Select Image"
        uploadedActionLabel="Upload New One"
      />
      <div className="pm-c-create-market-form__card-categories-group--row">
        <SelectInput
          label="Category"
          name="category"
          placeholder="Select Category"
          options={[
            {
              name: 'Crypto',
              value: 'crypto'
            },
            {
              name: 'Esports',
              value: 'esports'
            },
            {
              name: 'Sports',
              value: 'sports'
            },
            {
              name: 'Politics',
              value: 'politics'
            },
            {
              name: 'Weather',
              value: 'weather'
            },
            {
              name: 'Other',
              value: 'other'
            }
          ]}
        />
        <SelectInput
          label="Subcategory"
          name="subcategory"
          placeholder="Select Subcategory"
          options={[]}
          disabled
        />
      </div>
      <DateInput label="Closing Date - UTC" name="closingDate" />
    </div>
  );
}

export default CreateMarketFormConfigure;
