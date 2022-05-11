import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Form from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
const ContractMethods = ({ displayedContractFunctions, responses }) => {
  return displayedContractFunctions.map((item, key) => (
    <Card
      title={`${key + 1}. ${item?.name}`}
      size="small"
      style={{ marginBottom: '20px' }}
      key={key}
    >
      <Form layout="vertical" name={`${item.name}`}>
        {item.inputs.map((input, key) => (
          <Form.Item
            label={`${input.name} (${input.type})`}
            name={`${input.name}`}
            required
            style={{ marginBottom: '15px' }}
            key={key}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
        ))}
        <Form.Item style={{ marginBottom: '5px' }}>
          <Text style={{ display: 'block' }}>
            {responses[item.name]?.result &&
              `Response: ${JSON.stringify(responses[item.name]?.result)}`}
          </Text>
          <Button
            type="primary"
            htmlType="submit"
            loading={responses[item?.name]?.isLoading}
          >
            {item.stateMutability === 'view' ? 'Read🔎' : 'Transact💸'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  ));
};

export default ContractMethods;
