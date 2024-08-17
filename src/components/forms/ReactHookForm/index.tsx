import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../form.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setFormData } from '../../../redux/slices/selectedFormDataSlice';
import { useNavigate } from 'react-router-dom';
import { IFormDataWithGender, validationSchema } from '../../../utils/yup';

const ReactHookForm: FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormDataWithGender>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.selectedCountry.countries);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilteredCountries(countries.filter((country) => country.toLowerCase().includes(query)));
    setShowAutocomplete(!!query);
  };

  const handleCountrySelect = (country: string) => {
    setValue('country', country);
    setShowAutocomplete(false);
  };

  const onSubmit: SubmitHandler<IFormDataWithGender> = (formData) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      const pic = reader.result;
      const formDataWithImage = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        picture: pic as string,
        country: formData.country,
      };
      dispatch(setFormData(formDataWithImage));
      navigate('/');
    };
    const file = (formData.picture as FileList)[0];
    reader.readAsDataURL(file);
    reader.onerror = function () {
      throw new Error('Error on the file reading');
    };
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Name: </legend>
        <label className={styles.label} htmlFor="name">
          <input className={styles.formInput} id="name" type="text" {...register('name')} />
        </label>
        {errors.name && <p className={cn(styles.suggestion)}>{errors.name.message}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Age: </legend>
        <label className={styles.label} htmlFor="age">
          <input className={styles.formInput} id="age" type="number" {...register('age')} />
        </label>
        {errors.age && (
          <p className={cn(styles.suggestion)}>
            {errors.age.message?.split(',').map((line, index) => <span key={index}>{line}</span>)}
          </p>
        )}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Email: </legend>
        <label className={styles.label} htmlFor="email">
          <input className={styles.formInput} id="email" type="email" {...register('email')} />
        </label>
        {errors.email && <p className={cn(styles.suggestion)}>{errors.email.message}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Password: </legend>
        <label className={styles.label} htmlFor="password">
          <input
            className={styles.formInput}
            id="password"
            type="password"
            autoComplete="on"
            {...register('password')}
          />
        </label>
        {errors.password && (
          <p className={cn(styles.suggestion)}>
            {errors.password.message?.split('.').map((line, index) => <span key={index}>{line}</span>)}
          </p>
        )}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Confirm password: </legend>
        <label htmlFor="confirmPassword">
          <input className={styles.formInput} id="confirmPassword" type="password" {...register('confirmPassword')} />
        </label>
        {errors.confirmPassword && <p className={cn(styles.suggestion)}>{errors.confirmPassword.message}</p>}
      </fieldset>
      <fieldset className={cn(styles.container, styles.genderContainer)}>
        <legend className={styles.legend}>Gender: </legend>
        <label htmlFor="male">
          <input type="radio" id="male" value="male" checked {...register('gender')} />
          Male
        </label>
        <label htmlFor="female">
          <input type="radio" id="female" value="female" {...register('gender')} />
          Female
        </label>
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Upload Picture</legend>
        <label htmlFor="picture">
          <input id="picture" type="file" accept="image/png, image/jpeg" {...register('picture')} />
        </label>
        {errors.picture && <p className={cn(styles.suggestion)}>{errors.picture.message}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Country: </legend>
        <label htmlFor="country">
          <input
            className={styles.formInput}
            id="country"
            type="text"
            {...register('country')}
            onChange={handleCountryChange}
            placeholder="Country..."
            autoComplete="off"
          />
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
      <div className={styles.submitContainer}>
        <label htmlFor="terms">
          <input id="terms" type="checkbox" {...register('terms')} /> Accept Terms and Conditions
        </label>
        <button className={cn('button', styles.formButton)} type="submit">
          Submit
        </button>
      </div>
      {errors.terms && <p className={cn(styles.suggestion)}>{errors.terms.message}</p>}
    </form>
  );
};

export default ReactHookForm;
