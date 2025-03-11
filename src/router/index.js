import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import Main from '@/views/Main.vue'
import Join from '@/views/Join.vue'
import Profile from '@/views/Profile.vue'
import LeftSidebar from '@/views/LeftSidebar.vue'
import RightSidebar from '@/views/RightSidebar.vue'
import Feed from '@/views/Feed.vue'
import Messages from '@/views/Messages.vue'
import SideMessageBar from '@/views/SideMessageBar.vue'
import SideThinkingBar from '@/views/SideThinkingBar.vue'
import SearchBar from '@/views/SearchBar.vue'
import PrivateMessages from '@/views/PrivateMessages.vue'
import SendPrivateMessages from '@/views/SendPrivateMessages.vue'
import RightPaperPlane from '@/views/RightPaperPlane.vue'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        authRequired: false,
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      meta: {
        authRequired: false,
      }
    },
    {
      path: '/join',
      name: 'join',
      component: Join,
      meta: {
        authRequired: false,
      }
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '',
          components: {
            leftSidebar: LeftSidebar,
            focus: Feed,
            rightSidebar: RightSidebar
          },
          meta: {
            authRequired: true,
          }
        },
        {
          path: '/profile', 
          components: {
            leftSidebar: LeftSidebar,
            focus: Profile,
            rightSidebar: RightSidebar
          },
          meta: {
            authRequired: true,
          }
        },
        {
          path: '/messages',
          components: {
            leftSidebar: SideMessageBar,
            focus: Messages,
            rightSidebar: SideThinkingBar
          },
          meta: {
            authRequired: true,
          }
        },
        {
          path: '/search',
          components: {
            leftSidebar: LeftSidebar,
            focus: SearchBar,
            rightSidebar: RightSidebar
          },
          meta: {
            authRequired: true,
          }
        },
        {
          path: '/user/:userId/:userName',
          components: {
            leftSidebar: RightPaperPlane,
            focus: PrivateMessages,
            rightSidebar: SendPrivateMessages
          },
          meta: {
            authRequired: true,
          }
        }
      ],
      meta: {
        authRequired: true,  
      }
    },
    {
      path: '/:catchAll(.*)', 
      redirect: '/', 
    }
  ],
})

router.beforeEach((to, from, next) => {
	console.log()
	const isLoggedIn = localStorage.getItem('userLog') !== null;
	console.log('Guard triggered', to.path, 'isLoggedIn:', isLoggedIn);
  
	if (to.meta.authRequired && !isLoggedIn) {
	  next('/'); 
	} else {
	  next();
	}
  });
  

export default router;
