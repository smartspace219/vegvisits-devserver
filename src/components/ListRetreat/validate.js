import messages from '../../locale/messages';

const validate = values => {
  const errors = {}

  if (!values.roomType) {
    errors.roomType = messages.required;
  }

  return errors
}

export default validate
