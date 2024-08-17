import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './reactHookForm.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setFormData } from '../../redux/slices/selectedFormDataSlice';
import { useNavigate } from 'react-router-dom';
import { validationSchema } from '../../utils/yup';

interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  picture: string;
  country: string;
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ReactHookForm: FC = () => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.selectedCountry.countries);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange', // Live validation
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilteredCountries(countries.filter((country) => country.toLowerCase().includes(query)));
    setShowAutocomplete(!!query);
  };

  const handleCountrySelect = (country: string) => {
    setValue('country', country);
    setShowAutocomplete(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.picture && data.picture[0]) {
      const base64Picture = await convertFileToBase64(data.picture[0]);
      dispatch(
        setFormData({
          ...data,
          picture: base64Picture,
        }),
      );
    }
    navigate('/');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="container">
        <legend className={styles.legend}>Name: </legend>
        <label className={styles.label} htmlFor="name">
          <input className={styles.formInput} id="name" {...register('name')} />
        </label>
        {errors.name && <p className={cn(styles.suggestion)}>{errors.name.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Age: </legend>
        <label className={styles.label} htmlFor="age">
          <input className={styles.formInput} id="age" type="number" {...register('age')} />
        </label>
        {errors.age && <p className={cn(styles.suggestion)}>{errors.age.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Email: </legend>
        <label className={styles.label} htmlFor="email">
          <input className={styles.formInput} id="email" type="email" {...register('email')} />
        </label>
        {errors.email && <p className={cn(styles.suggestion)}>{errors.email.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Password: </legend>
        <label className={styles.label} htmlFor="password">
          <input className={styles.formInput} id="password" type="password" {...register('password')} />
        </label>
        {errors.password && <p className={cn(styles.suggestion)}>{errors.password.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Confirm password: </legend>
        <label htmlFor="confirmPassword">
          <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        </label>
        {errors.confirmPassword && <p className={cn(styles.suggestion)}>{errors.confirmPassword.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Gender: </legend>
        <label htmlFor="male">
          <input type="radio" id="male" value="male" {...register('gender')} />
          Male
        </label>

        <label htmlFor="female">
          <input type="radio" id="female" value="female" {...register('gender')} />
          Female
        </label>
        {errors.gender && <p className={cn(styles.suggestion)}>{errors.gender.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Accept Terms and Conditions: </legend>
        <label htmlFor="terms">
          <input id="terms" type="checkbox" {...register('terms')} />
        </label>
        {errors.terms && <p className={cn(styles.suggestion)}>{errors.terms.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Upload Picture</legend>
        <label htmlFor="picture">
          <input id="picture" type="file" accept="image/png, image/jpeg" {...register('picture')} />
        </label>
        {errors.picture && <p className={cn(styles.suggestion)}>{errors.picture.message}</p>}
      </fieldset>

      <fieldset className="container">
        <legend className={styles.legend}>Country: </legend>
        <label htmlFor="country">
          <input id="country" type="text" {...register('country')} onChange={handleCountryChange} />
        </label>
        {showAutocomplete && (
          <ul className={styles.autocompleteList}>
            {filteredCountries.map((country, index) => (
              <li key={index} onClick={() => handleCountrySelect(country)} className={styles.autocompleteItem}>
                {country}
              </li>
            ))}
          </ul>
        )}
        {errors.country && <p className={cn(styles.suggestion)}>{errors.country.message}</p>}
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ReactHookForm;
