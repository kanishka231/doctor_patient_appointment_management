"use client";
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button 
} from 'antd';
import dayjs from 'dayjs';


interface Doctor {
  _id: string;
  name: string;
}

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: any) => Promise<void>;
  initialData?: any;
  doctors?: Doctor[];
  session?: any;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  doctors = [],
  session
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode
        form.setFieldsValue({
          doctorId: initialData.doctorId || undefined,
          patientName: initialData.patientName,
          date: initialData.date ? dayjs(initialData.date) : undefined,
          type: initialData.type,
          notes: initialData.notes
        });
      } else {
        // Create mode
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      // Validate form
      const values = await form.validateFields();
      
      // Prepare submission data
      const submissionData = {
        ...values,
        date: values.date ? values.date.toISOString() : undefined,
        // For create mode, set doctor ID based on role
        doctorId: initialData 
          ? (values.doctorId || initialData.doctorId)
          : (session?.user?.role === "Admin"
              ? values.doctorId
              : session?.user?.id)
      };

      // Set loading state
      setLoading(true);

      // Submit appointment
      await onSubmit(submissionData);

      // Reset form and close modal
      form.resetFields();
      onClose();
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialData ? 'Edit Appointment' : 'Create New Appointment'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {initialData ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      ]}
    >
      <Form 
        form={form}
        layout="vertical"
        initialValues={{
          type: 'In-Person'
        }}
      >
        {session?.user?.role === "Admin" && (
          <Form.Item
            name="doctorId"
            label="Doctor"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select placeholder="Select a doctor">
              {doctors.map((doctor) => (
                <Select.Option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="patientName"
          label="Patient Name"
          rules={[{ required: true, message: 'Please input patient name' }]}
        >
          <Input placeholder="Enter patient name" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Appointment Type"
          rules={[{ required: true, message: 'Please select appointment type' }]}
        >
          <Select>
            <Select.Option value="In-Person">In-Person</Select.Option>
            <Select.Option value="Virtual">Virtual</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter any additional notes" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;