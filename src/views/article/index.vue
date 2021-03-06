<template>
  <div class="article-container">
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          slot="icon"
          class="avatar"
          width="35"
          height="35"
          round
          fit="cover"
          :src="article.aut_photo"
        ></van-image>
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          round
          class="follow-btn"
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article ? '' : 'plus'"
          @click="onFollow"
          :loading="isFollowLoading"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div
        class="content markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>
      <!-- 文章评论列表 -->
      <comment-list :source="articleId" :list='commentList' @update-total-count='totalCommentCount = $event'/>
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777" />

      <!-- 发布评论 -->
      <van-popup v-model="isPostShow" position="bottom"
        ><post-comment :target="articleId" @post-success="onPostSuccess"
      /></van-popup>
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import {
  getArticleDetail,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import { ImagePreview } from 'vant'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
export default {
  name: 'ArticleIndex',
  created () {
    this.loadArticle()
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  components: {
    CommentList,
    PostComment
  },
  data () {
    return {
      article: {},
      isFollowLoading: false,
      isCollectLoading: false,
      isPostShow: false, // 控制发布评论的
      commentList: [],
      totalCommentCount: 0
    }
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleDetail(this.articleId)
      this.article = data.data
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },
    handlePerviewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      this.isCollectLoading = true
      if (this.article.is_collected) {
        await deleteCollect(this.articleId)
      } else {
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.isCollectLoading = false
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude ? '' : '取消'}点赞成功`)
    },
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.totalCommentCount++
      this.isPostShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
}
.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333;
    margin-left: 5px;
  }
  .pubdate {
    color: #b4b4b4;
    font-size: 11px;
    margin-left: 5px;
  }
}
ul {
  list-style: unset;
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
.article-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  position: fixed;
  bottom: 0px;
  right: 0;
  left: 0;
  .comment-btn {
    width: 200px;
  }
}
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
</style>
