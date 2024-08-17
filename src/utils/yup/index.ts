import * as Yup from 'yup';

export interface IFormData {
    name: string;
    age: number;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
    picture: File | null;
    country: string;
}

const validExtensions = ['image/jpeg', 'image/png'];
const maxSizeInBytes = 2 * 1024 * 1024;

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter.')
    .required('Name is required'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .required('Age is required'),
  email: Yup.string().email('Invalid email format').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/,
        'Must have [0-9][a-z][A-Z][!@#$%^&*]',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions').required(),
  picture: Yup.mixed()
  .required('Picture is required')
      .test('fileType', 'Picture must be a PNG or JPEG', (value) => {
          if (value instanceof File) {
              return value && validExtensions.includes(value.type);
      }
  })
  .test('fileSize', 'Picture size must be under 2MB', (value) => {
      if (value instanceof File) {
          return value && value.size <= maxSizeInBytes;
      }
  }),
  country: Yup.string().required('Country is required'),
});

/* export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer('Age must be an integer'),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/,
      'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
  gender: Yup.string().required('Gender is required'),
  terms: Yup.bool().oneOf([true], 'You must accept the Terms and Conditions').required(),
  picture: Yup.mixed()
    .required('Picture is required')
    .test('fileType', 'Picture must be a PNG or JPEG', (value) => {
      return value && ['image/jpeg', 'image/png'].includes(value[0]?.type);
    })
    .test('fileSize', 'Picture size must be under 2MB', (value) => {
      return value && value[0]?.size <= 2 * 1024 * 1024;
    }),
  country: Yup.string().required('Country is required'),
}); */