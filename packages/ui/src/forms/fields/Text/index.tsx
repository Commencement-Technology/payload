'use client'
import type { ClientValidate } from 'payload/types'

import React, { useCallback, useEffect, useState } from 'react'

import type { Option } from '../../../elements/ReactSelect/types'
import type { Props } from './types'

import { useConfig } from '../../../providers/Config'
import { useLocale } from '../../../providers/Locale'
import LabelComp from '../../Label'
import useField from '../../useField'
import { withCondition } from '../../withCondition'
import { isFieldRTL } from '../shared'
import { TextInput } from './Input'
import './index.scss'

const Text: React.FC<Props> = (props) => {
  const {
    name,
    AfterInput,
    BeforeInput,
    Description,
    Error,
    Label: LabelFromProps,
    className,
    hasMany,
    inputRef,
    label,
    localized,
    maxLength,
    maxRows,
    minLength,
    minRows,
    path: pathFromProps,
    placeholder,
    required,
    rtl,
    style,
    validate,
    width,
  } = props

  const Label = LabelFromProps || <LabelComp label={label} required={required} />

  const locale = useLocale()

  const { localization: localizationConfig } = useConfig()

  const memoizedValidate: ClientValidate = useCallback(
    (value, options) => {
      if (typeof validate === 'function')
        return validate(value, { ...options, maxLength, minLength, required })
    },
    [validate, minLength, maxLength, required],
  )

  const { path, readOnly, setValue, showError, value } = useField({
    path: pathFromProps || name,
    validate: memoizedValidate,
  })

  const renderRTL = isFieldRTL({
    fieldLocalized: localized,
    fieldRTL: rtl,
    locale,
    localizationConfig: localizationConfig || undefined,
  })

  const [valueToRender, setValueToRender] = useState<
    { id: string; label: string; value: { value: number } }[]
  >([]) // Only for hasMany

  const handleHasManyChange = useCallback(
    (selectedOption) => {
      if (!readOnly) {
        let newValue
        if (!selectedOption) {
          newValue = []
        } else if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => option.value?.value || option.value)
        } else {
          newValue = [selectedOption.value?.value || selectedOption.value]
        }

        setValue(newValue)
      }
    },
    [readOnly, setValue],
  )

  // useEffect update valueToRender:
  useEffect(() => {
    if (hasMany && Array.isArray(value)) {
      setValueToRender(
        value.map((val, index) => {
          return {
            id: `${val}${index}`, // append index to avoid duplicate keys but allow duplicate numbers
            label: `${val}`,
            value: {
              // React-select automatically uses "label-value" as a key, so we will get that react duplicate key warning if we just pass in the value as multiple values can be the same. So we need to append the index to the toString() of the value to avoid that warning, as it uses that as the key.
              toString: () => `${val}${index}`,
              value: val?.value || val,
            },
          }
        }),
      )
    }
  }, [value, hasMany])

  return (
    <TextInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      Description={Description}
      Error={Error}
      Label={Label}
      className={className}
      hasMany={hasMany}
      inputRef={inputRef}
      maxRows={maxRows}
      minRows={minRows}
      onChange={
        hasMany
          ? handleHasManyChange
          : (e) => {
              setValue(e.target.value)
            }
      }
      path={path}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      rtl={renderRTL}
      showError={showError}
      style={style}
      value={(value as string) || ''}
      valueToRender={valueToRender as Option[]}
      width={width}
    />
  )
}

export default withCondition(Text)
