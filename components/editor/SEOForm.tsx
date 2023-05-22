import { FC, ChangeEventHandler, useState, useEffect } from 'react';
import classNames from 'classnames';
import slugify from 'slugify';

export interface SEOResult {
  meta: string;
  slug: string;
  tags: string;
}

interface Props {
  initialValue?: SEOResult;
  title?: string;
  onChange(result: SEOResult): void;
}

export const commonInputStyles = 'w-full p-2  transition bg-transparent border-2 rounded outline-none border-secondary-dark focus:border-primary-dark focus:dark:border-primary text-primary-dark dark:text-primary'

const SEOForm: FC<Props> = ({ initialValue, title = '', onChange }): JSX.Element => {
  const [values, setValues] = useState({
    meta: '',
    slug: '',
    tags: '',
  });

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({ target }) => {
    if (target.name == "meta" && target.value.length > 150) return;

    const newValues = { ...values, [target.name]: target.value }
    setValues(newValues)
    onChange(newValues)
  }

  useEffect(() => {
    const slug = slugify(title, { lower: true, strict: true });

    const newValues = { ...values, slug }
    setValues(newValues)
    onChange(newValues)
  }, [title])

  useEffect(() => {
    if (initialValue) setValues({ ...initialValue, slug: slugify(initialValue.slug, { lower: true, strict: true }) })
  }, [initialValue])

  const { meta, slug, tags } = values;

  return <div className='space-y-4'>
    <h1 className='text-xl font-semibold text-primary-dark dark:text-primary'>SEO Section</h1>

    <Input name='slug' placeholder='slug-goes-here' label='Slug:' value={slug} onChange={handleChange} />
    <Input name='tags' placeholder='React, Next JS' label='Tags:' value={tags} onChange={handleChange} />

    <div className="relative">
      <textarea name='meta' className={classNames(commonInputStyles, 'text-lg h-20 resize-none')} placeholder='Meta description 150 characters will be fine' onChange={handleChange} value={meta}></textarea>
      <p className='absolute text-sm bottom-3 right-3 text-primary-dark dark:text-primary'>{meta.length}/150</p>
    </div>
  </div>;
};

const Input: FC<{
  name?: string,
  value?: string,
  label?: string,
  placeholder?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>
}> = ({ name, value, label, placeholder, onChange }) => {
  return <label className='relative block'>
    <span className='absolute pl-2 text-sm font-semibold -translate-y-1/2 top-1/2 text-primary-dark dark:text-primary'>{label}</span>
    <input name={name} type="text" placeholder={placeholder} className={classNames(commonInputStyles, 'pl-10 italic')} onChange={onChange} value={value} />
  </label>
}

export default SEOForm;