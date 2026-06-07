import React from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shorts from './pages/content/Shorts'
import YoutubeSignin from './pages/auth/YoutubeSignin'
import CustomAlert, { showCustomAlert } from './component/CustomAlert'
import CreateAccount from './pages/auth/CreateAccount'
import getCurrentUser from './customHooks/UsegetCurrentUser'
import { useSelector } from 'react-redux'
import ForgetPassword from './pages/auth/ForgetPassword'
import CreateChannelFlow from './pages/channel/CreateChannelFlow'
import ViewChannel from './pages/channel/ViewChannel'
import UpdateChannel from './pages/channel/UpdateChannel'
import MobileProfile from './pages/user/MobileProfile'
import UsegetChannel from './customHooks/UsegetChannel'
import CreatePage from './pages/creator/CreatePage'
import CreateVideo from './pages/creator/CreateVideo'
import CreatePost from './pages/creator/CreatePost'
import CreateShorts from './pages/creator/CreateShorts'
import CreatePlaylist from './pages/creator/CreatePlaylist'
import UsegetChannelContent from './customHooks/UsegetChannelContent'
import UsegetAllContent from './customHooks/UsegetAllContentData'
import WatchVideoPage from './pages/content/WatchVideoPage'
import WatchShortPage from './pages/content/WatchShortPage'
import ChannelPage from './pages/channel/ChannelPage'
import SubscribePage from './pages/auth/SubscribePage'
import UseGetSubscribedContent from './customHooks/UseGetSubscribedContent'
import SavedPlaylistPage from './pages/user/SavedPlaylistPage'
import SavedContentPage from './pages/user/SavedContentPage'
import LikedContentPage from './pages/user/LikedContentPage'
import ScrollToTop from './component/ScrollToTop'
import HistoryPage from './pages/user/HistoryPage'
import UseGetHistory from './customHooks/UseGetHistroy'
import PTStudio from './pages/creator/PTStudio'
import Dashboard from './component/Dashboard'
import ContentPage from './component/ContentPage'
import AnalyticsPage from './component/AnalyticsPage'
import ManageVideo from './pages/creator/ManageVideo'
import ManageShort from './pages/creator/ManageShort'
import ManagePlaylist from './pages/creator/ManagePlaylist'
import UseGetRecommendation from './customHooks/UseGetRecommendation'
import RevenuePage from './component/RevenuePage'
import GlobalUploadManager from './component/GlobalUploadManager'
import { serverUrl } from './utils/constants'

// eslint-disable-next-line react-refresh/only-export-components
export { serverUrl }

const ProtectedRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  getCurrentUser()
  UsegetChannel()
  UsegetChannelContent()
  UsegetAllContent()
  UseGetSubscribedContent()
  UseGetHistory()
  UseGetRecommendation()

  const { userData } = useSelector(state => state.user)
  

 
  function ChannelPageWrapper() {
  const location = useLocation();
  return <ChannelPage key={location.pathname} />;
}

  return (
    <>
      <CustomAlert />
      <GlobalUploadManager />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='/shorts' element={<ProtectedRoute userData={userData}><Shorts /></ProtectedRoute>} />
          <Route path='/viewchannel' element={<ProtectedRoute userData={userData}><ViewChannel /></ProtectedRoute>} />
          <Route path='/updatechannel' element={<ProtectedRoute userData={userData}><UpdateChannel /></ProtectedRoute>} />
          <Route path='/mobileprofile' element={<MobileProfile />} />
        <Route path='/createpage' element={<ProtectedRoute userData={userData}><CreatePage /></ProtectedRoute>} />
          <Route path='/create-video' element={<ProtectedRoute userData={userData}><CreateVideo /></ProtectedRoute>} />
          <Route path='/create-post' element={<ProtectedRoute userData={userData}><CreatePost /></ProtectedRoute>} />
          <Route path='/create-short' element={<ProtectedRoute userData={userData}><CreateShorts /></ProtectedRoute>} />
          <Route path='/create-playlist' element={<ProtectedRoute userData={userData}><CreatePlaylist /></ProtectedRoute>} />
          <Route path='/watch-short/:shortId' element={<ProtectedRoute userData={userData}><WatchShortPage /></ProtectedRoute>} />
          <Route path='/channelpage/:channelId' element={<ProtectedRoute userData={userData}><ChannelPageWrapper/></ProtectedRoute>} />
          <Route path='/subscribepage' element={<ProtectedRoute userData={userData}><SubscribePage/></ProtectedRoute>} />
          <Route path='/saveplaylist' element={<ProtectedRoute userData={userData}><SavedPlaylistPage/></ProtectedRoute>} />
          <Route path='/savevideos' element={<ProtectedRoute userData={userData}><SavedContentPage/></ProtectedRoute>} />
          <Route path='/likedvideos' element={<ProtectedRoute userData={userData}><LikedContentPage/></ProtectedRoute>} />
          <Route path='/history' element={<ProtectedRoute userData={userData}><HistoryPage/></ProtectedRoute>} />

          
          
        </Route>

        {/* Routes outside Home */}
        <Route path='/signin' element={<YoutubeSignin />} />
        <Route path='/signup' element={<CreateAccount />} />
        <Route path='/forgetpassword' element={<ForgetPassword />}/>
        <Route path='/createchannel' element={<ProtectedRoute userData={userData}><CreateChannelFlow /></ProtectedRoute>} />
        <Route path='/watch-video/:videoId' element={<ProtectedRoute userData={userData}><WatchVideoPage /></ProtectedRoute>} />
        
       
       
       
       
     <Route path='/ptstudio' element={<ProtectedRoute userData={userData}><PTStudio /></ProtectedRoute>} >
   <Route path='/ptstudio/dashboard' element={<ProtectedRoute userData={userData}><Dashboard/></ProtectedRoute>} />
   <Route path='/ptstudio/content' element={<ProtectedRoute userData={userData}><ContentPage/></ProtectedRoute>} />
   <Route path='/ptstudio/analytics' element={<ProtectedRoute userData={userData}><AnalyticsPage/></ProtectedRoute>} />
   <Route path='/ptstudio/revenue' element={<ProtectedRoute userData={userData}><RevenuePage/></ProtectedRoute>} />
   <Route path='/ptstudio/managevideo/:videoId' element={<ProtectedRoute userData={userData}><ManageVideo/></ProtectedRoute>} />
   <Route path='/ptstudio/manageshort/:shortId' element={<ProtectedRoute userData={userData}><ManageShort/></ProtectedRoute>} />
   <Route path='/ptstudio/manageplaylist/:playlistId' element={<ProtectedRoute userData={userData}><ManagePlaylist/></ProtectedRoute>} />
    </Route>
    
   

        
        
      </Routes>
    </>
  )
}

export default App
