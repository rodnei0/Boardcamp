import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
    cpf: joi.string().pattern(new RegExp('^[0-9]{11,11}$')).required(),
    birthday: joi.string().pattern(new RegExp('[0-9]{4}[\-]?[0-9]{2}[\-]?[0-9]{2}')).required(),
})

export default customerSchema;