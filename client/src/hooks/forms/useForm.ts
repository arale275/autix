"use client";

import { useState, useCallback, useMemo } from "react";
import { z } from "zod";

// ========== Types ==========

interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

interface FormState<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  isSubmitting: boolean;
  submitCount: number;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => Promise<void> | void;
  resetOnSubmit?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  resetForm: (newValues?: Partial<T>) => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => Record<keyof T, string | null>;
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error: string | null;
    touched: boolean;
    dirty: boolean;
  };
}

// ========== Main Hook ==========

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
  resetOnSubmit = false,
}: UseFormOptions<T>): UseFormReturn<T> {
  // ========== State ==========

  const [formState, setFormState] = useState<FormState<T>>(() => ({
    values: { ...initialValues },
    errors: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as Record<keyof T, string | null>),
    touched: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>),
    dirty: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>),
    isSubmitting: false,
    submitCount: 0,
  }));

  // ========== Validation Functions ==========

  const validateField = useCallback(
    (field: keyof T, value?: any): string | null => {
      if (!validationSchema) return null;

      try {
        // יצירת אובייקט זמני עם הערך החדש
        const testValues = {
          ...formState.values,
          [field]: value !== undefined ? value : formState.values[field],
        };

        // ניסיון לvalidate את כל האובייקט
        validationSchema.parse(testValues);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          // חיפוש שגיאה ספציפית לשדה
          const fieldError = error.errors.find((err) =>
            err.path.includes(field as string)
          );
          return fieldError?.message || null;
        }
        return "שגיאה בבדיקת השדה";
      }
    },
    [validationSchema, formState.values]
  );

  const validateForm = useCallback((): Record<keyof T, string | null> => {
    const errors = {} as Record<keyof T, string | null>;

    if (!validationSchema) {
      Object.keys(initialValues).forEach((key) => {
        errors[key as keyof T] = null;
      });
      return errors;
    }

    try {
      validationSchema.parse(formState.values);
      Object.keys(initialValues).forEach((key) => {
        errors[key as keyof T] = null;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // תחילה, נאפס את כל השגיאות
        Object.keys(initialValues).forEach((key) => {
          errors[key as keyof T] = null;
        });

        // הוספת שגיאות ספציפיות
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof T;
          if (fieldName && fieldName in errors) {
            errors[fieldName] = err.message;
          }
        });
      }
    }

    return errors;
  }, [validationSchema, formState.values, initialValues]);

  // ========== Computed Values ==========

  const isValid = useMemo(() => {
    const errors = validateForm();
    return Object.values(errors).every((error) => error === null);
  }, [validateForm]);

  const isDirty = useMemo(() => {
    return Object.values(formState.dirty).some(Boolean);
  }, [formState.dirty]);

  // ========== Handlers ==========

  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setFormState((prev) => {
        const newValues = { ...prev.values, [field]: value };
        const isDirtyField = value !== initialValues[field];

        let newErrors = { ...prev.errors };

        // Validation on change
        if (validateOnChange) {
          const fieldError = validateField(field, value);
          newErrors[field] = fieldError;
        }

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          dirty: { ...prev.dirty, [field]: isDirtyField },
        };
      });
    },
    [validateField, validateOnChange, initialValues]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setFormState((prev) => {
        let newErrors = { ...prev.errors };

        // Validation on blur
        if (validateOnBlur) {
          const fieldError = validateField(field);
          newErrors[field] = fieldError;
        }

        return {
          ...prev,
          errors: newErrors,
          touched: { ...prev.touched, [field]: true },
        };
      });
    },
    [validateField, validateOnBlur]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        // Validate all fields
        const errors = validateForm();
        const hasErrors = Object.values(errors).some((error) => error !== null);

        setFormState((prev) => ({
          ...prev,
          errors,
          touched: Object.keys(prev.touched).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          }, {} as Record<keyof T, boolean>),
        }));

        if (hasErrors) {
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
          return;
        }

        // Call onSubmit if provided
        if (onSubmit) {
          await onSubmit(formState.values);
        }

        // Reset form if requested
        if (resetOnSubmit) {
          resetForm();
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [validateForm, onSubmit, resetOnSubmit, formState.values]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [field]: value },
        dirty: { ...prev.dirty, [field]: value !== initialValues[field] },
      }));
    },
    [initialValues]
  );

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const setFieldTouched = useCallback(
    (field: keyof T, touched: boolean = true) => {
      setFormState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: touched },
      }));
    },
    []
  );

  const resetForm = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues
        ? { ...initialValues, ...newValues }
        : { ...initialValues };

      setFormState({
        values: resetValues,
        errors: Object.keys(resetValues).reduce((acc, key) => {
          acc[key as keyof T] = null;
          return acc;
        }, {} as Record<keyof T, string | null>),
        touched: Object.keys(resetValues).reduce((acc, key) => {
          acc[key as keyof T] = false;
          return acc;
        }, {} as Record<keyof T, boolean>),
        dirty: Object.keys(resetValues).reduce((acc, key) => {
          acc[key as keyof T] = false;
          return acc;
        }, {} as Record<keyof T, boolean>),
        isSubmitting: false,
        submitCount: 0,
      });
    },
    [initialValues]
  );

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: formState.values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: formState.errors[field],
      touched: formState.touched[field],
      dirty: formState.dirty[field],
    }),
    [formState, handleChange, handleBlur]
  );

  // ========== Return ==========

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    dirty: formState.dirty,
    isSubmitting: formState.isSubmitting,
    isValid,
    isDirty,
    submitCount: formState.submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
    getFieldProps,
  };
}

// ========== Helper Hooks ==========

/**
 * Hook פשוט לטפסים בסיסיים
 */
export function useSimpleForm<T extends Record<string, any>>(initialValues: T) {
  return useForm({
    initialValues,
    validateOnChange: false,
    validateOnBlur: false,
  });
}

/**
 * Hook עם validation מלא
 */
export function useValidatedForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: z.ZodSchema<T>,
  onSubmit?: (values: T) => Promise<void> | void
) {
  return useForm({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit,
  });
}

// ייצוא ברירת מחדל
export default useForm;
