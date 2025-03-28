import { useState, useCallback } from 'react';
 
type FormErrors = Record<string, string>;
type FormValues = Record<string, string>;
 
interface UseFormProps {
  initialValues: FormValues;
  validate?: (values: FormValues) => FormErrors;
  onSubmit: (values: FormValues) => Promise<void> | void;
}
 
export const useForm = ({ initialValues, validate, onSubmit }: UseFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
 
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
 
    try {
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);
 
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};