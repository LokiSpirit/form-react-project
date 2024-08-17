import { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import styles from '../form.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setFormData } from '../../../redux/slices/selectedFormDataSlice';
import { useNavigate } from 'react-router-dom';
import { IFormData, validationSchema } from '../../../utils/yup';

const UncontrolledElementsForm: FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderMaleRef = useRef<HTMLInputElement>(null);
  const genderFemaleRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.selectedCountry.countries);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCountryChange = () => {
    const query = countryRef.current?.value.toLowerCase() || '';
    setFilteredCountries(countries.filter((country) => country.toLowerCase().includes(query)));
    setShowAutocomplete(!!query);
  };

  const handleCountrySelect = (country: string) => {
    if (countryRef.current) {
      countryRef.current.value = country;
    }
    setShowAutocomplete(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: IFormData = {
      name: nameRef.current?.value || '',
      age: parseInt(ageRef.current?.value as string, 10) || -1,
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      terms: termsRef.current?.checked || false,
      picture: pictureRef.current?.files ? pictureRef.current.files[0] : new File([''], 'text.txt'),
      country: countryRef.current?.value || '',
    };

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const reader = new FileReader();
      reader.onloadend = function () {
        const picture = reader.result;
        const formDataWithImage = {
          ...formData,
          gender: genderFemaleRef?.current?.value || 'male',
          picture: picture as string,
        };
        dispatch(setFormData(formDataWithImage));
        navigate('/');
      };
      reader.readAsDataURL(formData.picture as Blob);
      reader.onerror = function () {
        throw new Error('Error on file reading');
      };
    } catch (validationErrors) {
      const errors: { [key: string]: string } = {};
      (validationErrors as Yup.ValidationError).inner.forEach((error) => {
        if (error.path) errors[error.path] = error.message;
      });
      setErrors(errors);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Name: </legend>
        <label className={styles.label} htmlFor="name">
          <input className={styles.formInput} id="name" type="text" ref={nameRef} />
        </label>
        {errors.name && <p className={cn(styles.suggestion)}>{errors.name}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Age: </legend>
        <label className={styles.label} htmlFor="age">
          <input className={styles.formInput} id="age" type="number" ref={ageRef} />
        </label>
        {errors.age && <p className={cn(styles.suggestion)}>{errors.age}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Email: </legend>
        <label className={styles.label} htmlFor="email">
          <input className={styles.formInput} id="email" type="email" ref={emailRef} />
        </label>
        {errors.email && <p className={cn(styles.suggestion)}>{errors.email}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Password: </legend>
        <label className={styles.label} htmlFor="password">
          <input className={styles.formInput} id="password" type="password" ref={passwordRef} autoComplete="on" />
        </label>
        {errors.password && (
          <p className={cn(styles.suggestion)}>
            {errors.password.split('.').map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </p>
        )}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Confirm password: </legend>
        <label htmlFor="confirmPassword">
          <input className={styles.formInput} id="confirmPassword" type="password" ref={confirmPasswordRef} />
        </label>
        {errors.confirmPassword && <p className={cn(styles.suggestion)}>{errors.confirmPassword}</p>}
      </fieldset>
      <fieldset className={cn(styles.container, styles.genderContainer)}>
        <legend className={styles.legend}>Gender: </legend>
        <label htmlFor="male">
          <input type="radio" id="male" name="gender" value="male" defaultChecked ref={genderMaleRef} />
          Male
        </label>

        <label htmlFor="female">
          <input type="radio" id="female" name="gender" value="female" ref={genderFemaleRef} />
          Female
        </label>
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Upload Picture</legend>
        <label htmlFor="picture">
          <input name="picture" id="picture" type="file" accept="image/png, image/jpeg" ref={pictureRef} />
        </label>
        {errors.picture && <p className={cn(styles.suggestion)}>{errors.picture}</p>}
      </fieldset>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Country: </legend>
        <label htmlFor="country">
          <input
            className={styles.formInput}
            id="country"
            type="text"
            onChange={handleCountryChange}
            ref={countryRef}
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
        {errors.country && <p className={cn(styles.suggestion)}>{errors.country}</p>}
      </fieldset>
      <div className={styles.submitContainer}>
        <label htmlFor="terms">
          <input id="terms" type="checkbox" ref={termsRef} /> Accept Terms and Conditions
        </label>
        <button className={cn('button', styles.formButton)} type="submit">
          Submit
        </button>
      </div>
      {errors.terms && <p className={cn(styles.suggestion)}>{errors.terms}</p>}
    </form>
  );
};

export default UncontrolledElementsForm;
