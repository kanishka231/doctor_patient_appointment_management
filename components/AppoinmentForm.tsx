"use client";
import React, { useEffect } from 'react';
import { Modal, Form, Input, TimePicker, DatePicker, Select, message, InputNumber } from 'antd';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';
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
            if (session.user.role === 'Admin') {
                values.doctorId = selectedDoctor._id;
            } else {
                values.doctorId = session.user.id;
            }

            onSubmit({
                ...values,
                date: values.date.toDate(),
                doctorName: selectedDoctor ? selectedDoctor.name : '',
            });

            toast.success(
                `Appointment ${initialData ? 'updated' : 'created'} successfully!`, 
                {
                    style: {
                        borderRadius: '10px',
                        background: '#2d7a2d',
                        color: '#fff',
                        padding: '12px',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#2d7a2d',
                    },
                }
            );
            onClose();
        } catch (error) {
            console.error('Validation failed:', error);
            
            // Error toast
            toast.error('Failed to submit the form. Please check your inputs.', {
                style: {
                    borderRadius: '10px',
                    background: '#ff4d4f',
                    color: '#fff',
                    padding: '12px',
                    fontWeight: 'bold',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#ff4d4f',
                },
            });
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
       <>
        <Toaster 
        position="top-right"
        reverseOrder={false}
    />
        <Modal
            open={open}
            title={initialData ? 'Edit Appointment' : 'Create Appointment'}
            okText={initialData ? 'Update' : 'Create'}
            cancelText="Cancel"
            onCancel={onClose}
            onOk={handleSubmit}
            styles={{
                header: { 
                    backgroundColor: '#e6f3e6', 
                    borderBottom: '1px solid #b3e0b3' 
                },
                content: { 
                    backgroundColor: '#f0f9f0' 
                }
            }}
        >
            <Form 
                form={form} 
                layout="vertical" 
                name="appointmentForm"
                requiredMark={false}
                style={{ 
                    backgroundColor: '#f0f9f0', 
                    padding: '0 12px' 
                }}
            >
                <Form.Item
                    name="patientName"
                    label={<span style={{ color: '#2d7a2d' }}>Patient Name</span>}
                    rules={[{ required: true, message: 'Please input the patient name!' }]}
                >
                    <Input 
                        style={{ 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }} 
                    />
                </Form.Item>
                <Form.Item
                    name="patientAge"
                    label={<span style={{ color: '#2d7a2d' }}>Patient Age</span>}
                    rules={[{ required: true, message: 'Please input the patient age!' }]}
                >
                    <InputNumber 
                        min={1} 
                        max={120} 
                        style={{ 
                            width: '100%', 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }} 
                    />
                </Form.Item>
                <Form.Item
                    name="patientGender"
                    label={<span style={{ color: '#2d7a2d' }}>Patient Gender</span>}
                    rules={[{ required: true, message: 'Please select the patient gender!' }]}
                >
                    <Select 
                        style={{ 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }}
                    >
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="reasonForVisit"
                    label={<span style={{ color: '#2d7a2d' }}>Reason for Visit</span>}
                    rules={[{ required: true, message: 'Please select the reason for visit!' }]}
                >
                    <Select 
                        placeholder="Select reason for visit"
                        style={{ 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }}
                    >
                        <Select.Option value="Follow-up">Follow-up</Select.Option>
                        <Select.Option value="Medicines">Medicines</Select.Option>
                        <Select.Option value="Consultation">Consultation</Select.Option>
                        <Select.Option value="Routine Checkup">Routine Checkup</Select.Option>
                        <Select.Option value="Emergency">Emergency</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date"
                    label={<span style={{ color: '#2d7a2d' }}>Date and Time</span>}
                    rules={[{ required: true, message: 'Please select the date and time!' }]}
                >
                    <DatePicker 
                        showTime={{
                            format: 'HH:mm',
                            minuteStep: 15,
                        }}
                        format="YYYY-MM-DD HH:mm"
                        style={{ 
                            width: '100%', 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>
                <Form.Item
                    name="type"
                    label={<span style={{ color: '#2d7a2d' }}>Appointment Type</span>}
                    rules={[{ required: true, message: 'Please select the appointment type!' }]}
                >
                    <Select 
                        style={{ 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }}
                    >
                        <Select.Option value="In-Person">In-Person</Select.Option>
                        <Select.Option value="Virtual">Virtual</Select.Option>
                    </Select>
                </Form.Item>
                {session.user.role === 'Admin' ? (
                    <Form.Item
                        name="doctorId"
                        label={<span style={{ color: '#2d7a2d' }}>Doctor</span>}
                        rules={[{ required: true, message: 'Please select a doctor!' }]}
                    >
                        <Select 
                            style={{ 
                                borderColor: '#8ccd8c',
                                boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                            }}
                        >
                            {doctors.map((doctor: any) => (
                                <Select.Option key={doctor._id} value={doctor._id}>
                                    {doctor.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : null}
                <Form.Item 
                    name="notes" 
                    label={<span style={{ color: '#2d7a2d' }}>Notes</span>}
                >
                    <TextArea 
                        rows={4} 
                        style={{ 
                            borderColor: '#8ccd8c',
                            boxShadow: '0 0 5px rgba(140, 205, 140, 0.2)' 
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
       </>
    );
};

export default AppointmentForm;