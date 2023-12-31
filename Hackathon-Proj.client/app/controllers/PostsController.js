import { AppState } from "../AppState.js"
import { Ad } from "../models/Ad.js"
import { postsService } from "../services/PostsServices.js"
import { getFormData } from "../utils/FormHandler.js"
import { Pop } from "../utils/Pop.js"
import { setHTML } from "../utils/Writer.js"

let randNum = null
let pageLoaded = false

function _drawProfileAbilities() {
  setHTML('profileInfo', /*HTML*/`
    <p class="text-decoration-underline selectable" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProfile" aria-controls="offcanvasProfile">
      Profile
    </p>`)
}
function _drawPosts() {
  _drawBackground()
  let template = ''
  const posts = AppState.posts
  const sort = AppState.sort
  if (sort == 'comment' || sort == 'hot') {
    posts.sort((a, b) => b[`${sort}Count`] - a[`${sort}Count`])
  }
  if (!pageLoaded) {
    randNum = Math.floor(Math.random() * (posts.length - 1))
    pageLoaded = true
  }
  for (let i = 0; i < posts.length; i++) {
    template += posts[i].PostTemplate
    if (i == randNum) {
      template += Ad.AdTemplate
    }
  }
  setHTML('postTemplate', template)
}
function _drawActivePosts() {
  setHTML('activePost', AppState.activePost?.ActivePostTemplate)
}
function _drawBackground() {
  const posts = AppState.posts
  if (!posts[0]) {
    return
  }
  let mostHots = posts[0]
  posts.forEach(p => {
    if (p.hotCount > mostHots.hotCount || (p.hotCount == mostHots.hotCount && p.lastHotDate > mostHots.lastHotDate)) {
      mostHots = p
    }
  })
  let url = mostHots.postImg
  document.body.style.backgroundImage = `url('${url}')`
}

export class PostsController {
  constructor() {
    console.log("Profiles Controller Loaded.")
    this.getPosts()
    AppState.on('account', this.getPosts)
    AppState.on('account', this.getPostsByProfileId)
    AppState.on('posts', _drawPosts)
    AppState.on('activePost', _drawActivePosts)
    AppState.on('hots', this.getPostsByProfileId)
  }
  setActivePost(postId) {
    try {
      postsService.setActivePost(postId)
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async sortPosts(event) {
    try {
      event.preventDefault()
      const form = event.target
      const formData = getFormData(form)
      await postsService.sortPosts(formData?.filter)
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async getPosts() {
    try {
      if (AppState.account) {
        _drawProfileAbilities()
      }
      await postsService.getPosts()
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async getPostsByProfileId() {
    try {
      if (!AppState.account) {
        return
      }
      await postsService.getPostsByProfileId()
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async createPost(event) {
    try {
      event.preventDefault()
      const form = event.target
      await postsService.createPost(getFormData(form))
      // @ts-ignore
      bootstrap.Offcanvas.getOrCreateInstance('#offcanvasProfile').hide()
      window.scrollTo(0, 0)
      form.reset()
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async removePost() {
    try {
      const isSure = await Pop.confirm(`Are you sure you want to delete ${AppState.activePost?.title}`)
      if (!isSure) {
        return
      }
      await postsService.removePost()
      // @ts-ignore
      bootstrap.Modal.getOrCreateInstance('#staticBackdrop').hide()
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
  async updatePost(event) {
    try {
      event.preventDefault()
      const form = event.target
      await postsService.updatePost(getFormData(form))
      form.reset()
    } catch (error) {
      console.log(error)
      Pop.error(error.message)
    }
  }
}