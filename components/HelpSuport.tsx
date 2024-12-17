import React, { useState } from 'react';
import { 
  Collapse, 
  Input, 
  Button, 
  Form, 
  Select, 
  Alert 
} from 'antd';
import { 
  QuestionCircleOutlined, 
  MessageOutlined, 
  PhoneOutlined 
} from '@ant-design/icons';

const { Panel } = Collapse;
const { TextArea } = Input;

const HelpAndSupport: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const faqData = [
    {
      key: '1',
      label: 'How do I book an appointment?',
      content: 'You can book an appointment by navigating to the Appointments section and clicking "Create Appointment". Select your preferred doctor, date, and time.'
    },
    {
      key: '2',
      label: 'Can I reschedule my appointment?',
      content: 'Yes, you can reschedule by contacting our support team or cancelling the existing appointment and creating a new one.'
    },
    {
      key: '3',
      label: 'What documents should I bring?',
      content: 'Please bring your government-issued ID, insurance card, and any relevant medical records.'
    }
  ];

  const handleSubmit = (values:any) => {
    // Implement support ticket submission logic
    console.log('Support ticket:', values);
    setSubmissionStatus('success');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Help & Support</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <QuestionCircleOutlined className="text-4xl text-green-600 mb-4" />
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <p>Find answers to common questions</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <MessageOutlined className="text-4xl text-green-600 mb-4" />
          <h2 className="text-xl font-semibold">Chat Support</h2>
          <p>Get instant help from our support team</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <PhoneOutlined className="text-4xl text-green-600 mb-4" />
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p>Reach out via phone or email</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Collapse accordion>
          {faqData.map(faq => (
            <Panel header={faq.label} key={faq.key}>
              <p>{faq.content}</p>
            </Panel>
          ))}
        </Collapse>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Submit a Support Ticket</h2>
        
        {submissionStatus === 'success' && (
          <Alert 
            message="Support Ticket Submitted" 
            description="Our team will get back to you soon." 
            type="success" 
            showIcon 
            className="mb-4"
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            name="issueType" 
            label="Issue Type"
            rules={[{ required: true, message: 'Please select an issue type' }]}
          >
            <Select placeholder="Select issue type">
              <Select.Option value="technical">Technical Issue</Select.Option>
              <Select.Option value="billing">Billing Inquiry</Select.Option>
              <Select.Option value="appointment">Appointment Related</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Describe Your Issue"
            rules={[{ required: true, message: 'Please describe your issue' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Provide detailed information about your issue"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Support Ticket
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default HelpAndSupport;