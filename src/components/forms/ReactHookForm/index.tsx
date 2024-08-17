import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../form.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setFormData } from '../../../redux/slices/selectedFormDataSlice';
import { useNavigate } from 'react-router-dom';
import { IFormDataWithGender, validationSchema } from '../../../utils/yup';
import { evaluatePasswordStrength } from '../../../utils/passwordStrength';

const ReactHookForm: FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
  const [strength, setStrength] = useState<null | string>(null);

  const watchPassword = watch('password', '');

  useEffect(() => {
    if (watchPassword) {
      setStrength(evaluatePasswordStrength(watchPassword));
    }
  }, [watchPassword]);

  const watchCountry = watch('country', '');

  useEffect(() => {
    if (watchCountry && !watchCountry.includes('country')) {
      const query = watchCountry.toLowerCase();
      setFilteredCountries(countries.filter((country) => country.toLowerCase().includes(query)));
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [watchCountry, countries]);

  const handleCountrySelect = (country: string) => {
    setValue('country', `${country} country`);
  };

  const onSubmit: SubmitHandler<IFormDataWithGender> = (formData) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      const pic = reader.result;
      const country = formData.country.includes('country') ? formData.country.slice(0, -8) : formData.country;
      const formDataWithImage = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        picture: pic as string,
        country,
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
    <>
      <h2>React Form</h2>
      <form className={cn(styles.form, styles.react)} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.container}>
          <legend className={styles.legend}>Name: </legend>
          <label className={styles.label} htmlFor="name">
            <input className={cn(styles.formInput, styles.react)} id="name" type="text" {...register('name')} />
          </label>
          {errors.name && <p className={cn(styles.suggestion)}>{errors.name.message}</p>}
        </fieldset>
        <fieldset className={styles.container}>
          <legend className={styles.legend}>Age: </legend>
          <label className={styles.label} htmlFor="age">
            <input className={cn(styles.formInput, styles.react)} id="age" type="number" {...register('age')} />
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
            <input className={cn(styles.formInput, styles.react)} id="email" type="email" {...register('email')} />
          </label>
          {errors.email && <p className={cn(styles.suggestion)}>{errors.email.message}</p>}
        </fieldset>
        <fieldset className={styles.container}>
          <legend className={styles.legend}>Password: </legend>
          <label className={styles.label} htmlFor="password">
            <input
              className={cn(styles.formInput, styles.react)}
              id="password"
              type="password"
              autoComplete="on"
              {...register('password')}
            />
            {watchPassword && (
              <small>
                Password strength:&nbsp;
                <span
                  className={
                    strength === 'Weak'
                      ? styles.strengthWeak
                      : strength === 'Medium'
                        ? styles.strengthMedium
                        : styles.strengthStrong
                  }
                >
                  {strength}
                </span>
              </small>
            )}
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
            <input
              className={cn(styles.formInput, styles.react)}
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
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
              className={cn(styles.formInput, styles.react)}
              id="country"
              type="text"
              {...register('country')}
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
    </>
  );
};

export default ReactHookForm;
