// @ts-nocheck
import { Suspense } from "react";
import loadingAnime from './assets/loading.gif';
import { Outlet } from "react-router-dom";
import CommunityChat from "./components/CommunityChat";
import Header from "./components/landing/Header";
import { Footer } from "./components/landing";
import NotificationBubble from "./components/NotificationBubble";

function App() {
  return (
    <>
      <Header />
      <div className="min-h-screen ml-[44px] md:ml-0 pt-[104px] xl:pt-[116px]">
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#fff',
            color: '#3b1a62',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}><img src={loadingAnime} alt="Loading..." style={{width:"100px"}} /></div>
          </div>
        }>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
      {/* <CommunityChat /> */}
      {/* <NotificationBubble /> */}
    </>
  )
}

export default App
