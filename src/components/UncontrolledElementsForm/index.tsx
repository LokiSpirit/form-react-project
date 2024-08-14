import { FC, useRef, useState } from 'react';
import styles from './uncontrolledElementsForm.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setFormData } from '../../redux/slices/selectedFormDataSlice';
import { useNavigate } from 'react-router-dom';

const validExtensions = ['image/jpeg', 'image/png'];
const maxSizeInBytes = 2 * 1024 * 1024;

const UncontrolledElementsForm: FC = () => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.selectedCountry.countries);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  const [name, setName] = useState(false);
  const [age, setAge] = useState(false);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [imageType, setImageType] = useState(false);
  const [imageSize, setImageSize] = useState(false);

  const navigate = useNavigate();

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

  const validateForm = () => {
    if (
      !nameRef.current ||
      !ageRef.current ||
      !emailRef.current ||
      !passwordRef.current ||
      !confirmPasswordRef.current ||
      (!genderMaleRef.current && !genderMaleRef.current) ||
      !termsRef.current ||
      !pictureRef.current ||
      !countryRef.current
    ) {
      return false;
    }

    const nameValue = nameRef.current.value;
    if (!/^[A-Z]/.test(nameValue)) {
      setName(true);
    } else {
      setName(false);
    }

    const ageValue = ageRef.current.value;
    if (isNaN(Number(ageValue)) || Number(ageValue) <= 0) {
      setAge(true);
    } else {
      setAge(false);
    }

    const emailValue = emailRef.current.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setEmail(true);
    } else {
      setEmail(false);
    }

    const passwordValue = passwordRef.current.value;
    const confirmPasswordValue = confirmPasswordRef.current.value;
    const passwordStrengthRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/;
    if (!passwordStrengthRegex.test(passwordValue)) {
      setPassword(true);
    } else {
      setPassword(false);
    }

    if (passwordValue !== confirmPasswordValue) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }

    if (!termsRef.current.checked) {
      setTerms(true);
    } else {
      setTerms(false);
    }

    const pictureValue = pictureRef.current.files?.[0];
    if (pictureValue) {
      if (!validExtensions.includes(pictureValue.type)) {
        setImageType(true);
      } else {
        setImageType(false);
      }
      if (pictureValue.size > maxSizeInBytes) {
        setImageSize(true);
      } else {
        setImageSize(false);
      }
    }
    if (name || age || email || password || confirmPassword || terms || imageType || imageSize) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && pictureRef.current?.files) {
      const file = pictureRef.current.files[0];
      const reader = new FileReader();
      reader.onloadend = function () {
        const picture = reader.result;
        const formData = {
          name: nameRef.current?.value || '',
          age: parseInt(ageRef.current?.value as string, 10) || 0,
          email: emailRef.current?.value || '',
          password: passwordRef.current?.value || '',
          gender: genderMaleRef.current?.value || genderFemaleRef.current?.value || '',
          picture: picture as string,
          country: countryRef.current?.value || '',
        };
        dispatch(setFormData(formData));
        navigate('/');
      };
      reader.readAsDataURL(file);
      reader.onerror = function () {
        throw new Error('Error on file reading');
      };
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className="container">
        <legend className={styles.legend}>Name: </legend>
        <label className={styles.label} htmlFor="name">
          <input className={styles.formInput} id="name" type="text" ref={nameRef} />
        </label>
        {name && <p className={cn(styles.suggestion)}>Name must start with an uppercase letter.</p>}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Age: </legend>
        <label className={styles.label} htmlFor="age">
          <input className={styles.formInput} id="age" type="number" ref={ageRef} />
        </label>
        {age && <p className={cn(styles.suggestion)}>Age must be a positive number.</p>}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Email: </legend>
        <label className={styles.label} htmlFor="email">
          <input className={styles.formInput} id="email" type="email" ref={emailRef} />
        </label>
        {email && <p className={cn(styles.suggestion)}>Invalid email format</p>}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Password: </legend>
        <label className={styles.label} htmlFor="password">
          <input className={styles.formInput} id="password" type="password" ref={passwordRef} autoComplete="on" />
        </label>
        {password && (
          <p className={cn(styles.suggestion)}>
            Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character.
          </p>
        )}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Confirm password: </legend>
        <label htmlFor="confirmPassword">
          <input id="confirmPassword" type="password" ref={confirmPasswordRef} />
        </label>
        {confirmPassword && <p className={cn(styles.suggestion)}>Passwords do not match.</p>}
      </fieldset>
      <fieldset className="container">
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
      <fieldset className="container">
        <legend className={styles.legend}>Accept Terms and Conditions: </legend>
        <label htmlFor="terms">
          <input id="terms" type="checkbox" ref={termsRef} />
        </label>
        {terms && <p className={cn(styles.suggestion)}>You must accept the Terms and Conditions.</p>}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Upload Picture</legend>
        <label htmlFor="picture">
          <input id="picture" type="file" accept="image/png, image/jpeg" ref={pictureRef} />
        </label>
        {imageType && <p className={cn(styles.suggestion)}>Picture must be a PNG or JPEG.</p>}
        {imageSize && <p className={cn(styles.suggestion)}>Picture size must be under 2MB.</p>}
      </fieldset>
      <fieldset className="container">
        <legend className={styles.legend}>Country: </legend>
        <label htmlFor="country">
          <input id="country" type="text" onChange={handleCountryChange} ref={countryRef} />
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
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledElementsForm;
