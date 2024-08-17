import * as Yup from 'yup';

export interface IFormData {
    name: string;
    age: number;
    email: string;
    password: string;
    confirmPassword: string;
    terms: NonNullable<boolean | undefined>;
    picture: File | FileList;
    country: string;
}

export interface IFormDataWithGender extends IFormData {
    gender: string;
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
      /^(?=.*[0-9])/,
        'Password must contain at least. 1 number'
    )
    .matches(
      /^(?=.*[A-Z])/,
        'Password must contain at least. 1 uppercase letter',
    )
    .matches(
      /^(?=.*[a-z])/,
        'Password must contain at least. 1 lowercase letter'
    )
    .matches(
      /^(?=.*[!@#$%^&*])/,
        'Password must contain at least. 1 special character: !@#$%^&*',
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
              return validExtensions.includes(value.type);
          }
          if (value instanceof FileList) {
              return validExtensions.includes(value[0]?.type);
          }
  })
  .test('fileSize', 'Picture size must be under 2MB', (value) => {
      if (value instanceof File) {
          return value.size <= maxSizeInBytes;
      }
      if (value instanceof FileList) {
              return value[0]?.size <= maxSizeInBytes;
          }
  }),
    country: Yup.string().required('Country is required'),
});