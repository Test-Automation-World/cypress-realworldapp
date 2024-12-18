import { faker } from '@faker-js/faker'

export default class Utils {
  static generateNewArticleData(includeTags = true) {
    let tagList = []
    if (includeTags) {
      tagList = [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()]
    }
    return {
      article: {
        title: `${faker.lorem.words(5)}`,
        description: `${faker.lorem.sentence(8)}`,
        body: `${faker.lorem.paragraphs(2)}`,
        tagList: tagList
      }
    }
  }

  static generateUserSettingsData() {
    return {
      user: {
        image: faker.internet.url(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
  }

  static generateNewUserData() {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()

    }
  }
}
