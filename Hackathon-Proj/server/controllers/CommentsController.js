import { Auth0Provider } from "@bcwdev/auth0provider";
import { commentsService } from "../services/CommentsService.js";
import BaseController from "../utils/BaseController.js";
import { commentHotsService } from "../services/CommentHotsService.js";

export class CommentsController extends BaseController {
  constructor() {
    super('api/comments')
    this.router
      .get('/:commentId', this.getCommentById)
      .get('/:commentId/commentHots', this.getCommentHotsByCommentId)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createComment)
      .delete('/:commentId', this.removeComment)
      .delete('/:commentId/commentHots', this.removeCommentHotsByCommentId)
      .put('/:commentId', this.editComment)
  }
  async getCommentById(req, res, next) {
    try {
      const comment = await commentsService.getCommentsById(req.params.commentId)
      return res.send(comment)
    } catch (error) {
      next(error);
    }
  }
  async getCommentHotsByCommentId(req, res, next) {
    try {
      const commentId = req.params.commentId
      const hots = await commentHotsService.getCommentHotsByCommentId(commentId)
      return res.send(hots)
    } catch (error) {
      next(error);
    }
  }
  async createComment(req, res, next) {
    try {
      const commentData = req.body
      commentData.profileId = req.userInfo.id
      const comment = await commentsService.createComment(commentData)
      return res.send(comment)
    } catch (error) {
      next(error);
    }
  }
  async removeComment(req, res, next) {
    try {
      const commentId = req.params.commentId
      const profileId = req.userInfo.id
      await commentsService.removeComment(commentId, profileId)
      return res.send('Comment Removed')
    } catch (error) {
      next(error);
    }
  }
  async removeCommentHotsByCommentId(req, res, next) {
    try {
      const commentId = req.params.commentId
      const profileId = req.userInfo.id
      await commentHotsService.removeCommentHotsByCommentId(commentId, profileId)
      return res.send()
    } catch (error) {
      next(error);
    }
  }
  async editComment(req, res, next) {
    try {
      const commentData = req.body
      const commentId = req.params.commentId
      const userId = req.userInfo.id
      const updatedComment = await commentsService.editComment(commentData, commentId, userId)
      return res.send(updatedComment)
    } catch (error) {
      next(error)
    }
  }
}