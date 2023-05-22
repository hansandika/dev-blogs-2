import Joi, {ObjectSchema} from "joi";

export const errorMessages = {
  INVALID_TITLE: "Title is missing!",
  INVALID_TAGS: "Tags must be array of strings!",
  INVALID_SLUG: "Slug is missing!",
  INVALID_META: "Meta description is missing!",
  INVALID_CONTENT: "Post content is missing!",
}

export const postValidationSchema = Joi.object().keys({
  title : Joi.string().required().messages({
    "string.empty": errorMessages.INVALID_TITLE,
    "any.required": errorMessages.INVALID_TITLE
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "string.base" : errorMessages.INVALID_TAGS,
    "string.empty" : errorMessages.INVALID_TAGS,
  }),
  slug: Joi.string().required().messages({
    "string.empty": errorMessages.INVALID_SLUG,
    "any.required": errorMessages.INVALID_SLUG
  }),
  meta: Joi.string().required().messages({
    "string.empty": errorMessages.INVALID_META,
    "any.required": errorMessages.INVALID_META
  }),
  content: Joi.string().required().messages({
    "string.empty": errorMessages.INVALID_CONTENT,
    "any.required": errorMessages.INVALID_CONTENT
  })
})

export const validateSchema = (schema: ObjectSchema, value: any) => {
  const {error} = schema.validate(value, {
    errors: {label: "key", wrap: {label: false, array: false}},
    allowUnknown: true,
  })

  if(error){
    const errors = error.details.map((err) => err.message)
    return errors
  }

  return null
}