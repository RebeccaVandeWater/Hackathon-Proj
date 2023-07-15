import { hotsService } from "../services/HotsService.js";
import { Pop } from "../utils/Pop.js";

export class HotsController {
  constructor() {
    console.log('hots controller')
  }

  async createHotPost(postId) {
    try {

      await hotsService.createHotPost(postId)
    } catch (error) {
      console.log(error)
      Pop.error(error.message)

    }
  }

}