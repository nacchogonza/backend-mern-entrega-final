import faker from 'faker';

faker.locale = 'es';

const getProduct = () => ({
  title: faker.name.jobTitle(),
  price: faker.datatype.float(),
  thumbnail: faker.image.animals(),
})

export { getProduct }