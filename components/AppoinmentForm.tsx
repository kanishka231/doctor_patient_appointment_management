"use client";
import React from 'react';
import { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: any;
  session: any;
  doctors: any[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  session,
  doctors,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
    
      const selectedDoctor = doctors.find(doctor => doctor._id === values.doctorId);
      if (session.user.role === 'Admin'){
        values.doctorId = selectedDoctor._id;
      }else {
        values.doctorId = session.user.id;
      }
      onSubmit({
        ...values,
        date: values.date.toDate(),
        doctorName: selectedDoctor ? selectedDoctor.name : '',
      });
      message.success(`Appointment ${initialData ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Failed to submit the form. Please check your inputs.');
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        date: dayjs(initialData.date),
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  return (
    <Modal
      open={open}
      title={initialData ? 'Edit Appointment' : 'Create Appointment'}
      okText={initialData ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        name="appointmentForm"
      >
        <Form.Item
          name="patientName"
          label="Patient Name"
          rules={[{ required: true, message: 'Please input the patient name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Appointment Type"
          rules={[{ required: true, message: 'Please select the appointment type!' }]}
        >
          <Select>
            <Select.Option value="In-Person">In-Person</Select.Option>
            <Select.Option value="Virtual">Virtual</Select.Option>
          </Select>
        </Form.Item>
       {session.user.role === 'Admin'
       ? ( <Form.Item
        name="doctorId"
        label="Doctor"
        rules={[{ required: true, message: 'Please select a doctor!' }]}
      >
        <Select>
          {doctors.map((doctor: any) => (
            <Select.Option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>):('')
       }
        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;



