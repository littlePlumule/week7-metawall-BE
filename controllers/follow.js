const Follow = require('../models/follow');
const { success } = require('../service/response');
const appError = require('../service/appError');

const followControllers = {
  /*
  async getFollow(req, res, next) {
    const { id } = req.params
    const follow = await Follow.findOne({ userId: id })
    .populate({
      path: 'following',
      populate:{path: 'user'}
    })
    .populate({
      path: 'follower',
      populate: {path: 'user'}
    })
    success(res, follow)
  },
  async updateFollow(req, res, next) {
    const userId = req.user.id;
    const updateFollowUserId = req.params.id;
    if (userId == updateFollowUserId) {
      return next(appError(400, '無法追蹤自己的帳號'))
    }
    const isFollow = await Follow.findOne({
      userId: userId,
      'following.user': updateFollowUserId,
    })
    let method = ''
    if (isFollow) {
      method = '$pull'
    } else {
      method = '$push'
    }

    const myFollow = await Follow.findOneAndUpdate(
      { userId: userId },
      { [method]: { following: { user: updateFollowUserId } } },
      { returnDocument: 'after' }
    )
      .populate({
        path: 'following',
        populate: { path: 'user' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'user' },
      })
    const otherFollow = await Follow.findOneAndUpdate({ userId: updateFollowUserId }, { [method]: { follower: { user: userId } } }, { returnDocument: 'after' })
      .populate({
        path: 'following',
        populate: { path: 'user' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'user' },
      })
    const follow = {
      myFollow, otherFollow 
    }
    success(res, follow)
  },
  */
  async postFollow(req, res, next) {
    const { user } = req;
    const otherUser = req.params.id;
    if (otherUser === user.id) {
      return next(appError(400, '無法追蹤自己'));
    }

    const existedTracking = await Follow.findOne({
      editor: user.id,
      following: otherUser,
      logicDeleteFlag: false
    })

    if (existedTracking) {
      return next(appError(400, '已追蹤該會員'));
    }

    await Follow.findOneAndUpdate({
      editor: user.id,
      following: otherUser
    },
    {
      $setOnInsert: {
        editor: user.id,
        following: otherUser
      },
      $set: {logicDeleteFlag: false}
    },
    {
      upsert: true
    });

    success(res, '追蹤成功');
  },
  async deleteFollow(req, res, next) {
    const { user } = req;
    const otherUser = req.params.id;
    const existedTracking = await Follow.findOne({
      editor: user.id,
      following: otherUser,
      logicDeleteFlag: true
    });
    if (!existedTracking) {
      return next(appError(400, '尚未追蹤該用戶'))
    }
    await Follow.findOneAndUpdate({
      editor: user.id,
      following: otherUser,
    },
    {
      $setOnInsert: {
        editor: user.id,
        following: otherUser
      },
      $set: {logicDeleteFlag: true}
    },
    {
      upsert: true
    });
    success(res, '取消追蹤成功')
  },
}

module.exports = followControllers;