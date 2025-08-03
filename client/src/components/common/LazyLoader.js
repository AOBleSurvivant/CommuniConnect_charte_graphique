import React, { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy loading des pages principales
const HomePageLazy = lazy(() => import('../../pages/HomePage'));
const FeedPageLazy = lazy(() => import('../../pages/Feed/FeedPage'));
const AlertsPageLazy = lazy(() => import('../../pages/Alerts/AlertsPage'));
const EventsPageLazy = lazy(() => import('../../pages/Events/EventsPage'));
const LivestreamsPageLazy = lazy(() => import('../../pages/Livestreams/LivestreamsPage'));
const HelpPageLazy = lazy(() => import('../../pages/Help/HelpPage'));
const MapPageLazy = lazy(() => import('../../pages/Map/MapPage'));
const MessagesPageLazy = lazy(() => import('../../pages/Messages/MessagesPage'));
const FriendsPageLazy = lazy(() => import('../../pages/Friends/FriendsPage'));
const CommuniConseilPageLazy = lazy(() => import('../../pages/CommuniConseil'));
const CommuniConseilAdminDashboardLazy = lazy(() => import('../../pages/Admin/CommuniConseilAdminDashboard'));
const ProfilePageLazy = lazy(() => import('../../pages/Profile/ProfilePage'));
const ModerationPageLazy = lazy(() => import('../../pages/Moderation/ModerationPage'));
const AdminDashboardLazy = lazy(() => import('../../pages/Admin/AdminDashboard'));

// Composant de fallback pour le lazy loading
const LazyFallback = ({ message = "Chargement..." }) => (
  <LoadingSpinner fullScreen message={message} />
);

// Wrapper pour les composants lazy avec Suspense
const withSuspense = (LazyComponent, fallbackMessage) => {
  return (props) => (
    <Suspense fallback={<LazyFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Export des composants avec Suspense
export const LazyHomePage = withSuspense(HomePageLazy, "Chargement de la page d'accueil...");
export const LazyFeedPage = withSuspense(FeedPageLazy, "Chargement du fil d'actualité...");
export const LazyAlertsPage = withSuspense(AlertsPageLazy, "Chargement des alertes...");
export const LazyEventsPage = withSuspense(EventsPageLazy, "Chargement des événements...");
export const LazyLivestreamsPage = withSuspense(LivestreamsPageLazy, "Chargement des lives...");
export const LazyHelpPage = withSuspense(HelpPageLazy, "Chargement des demandes d'aide...");
export const LazyMapPage = withSuspense(MapPageLazy, "Chargement de la carte...");
export const LazyMessagesPage = withSuspense(MessagesPageLazy, "Chargement des messages...");
export const LazyFriendsPage = withSuspense(FriendsPageLazy, "Chargement des amis...");
export const LazyCommuniConseilPage = withSuspense(CommuniConseilPageLazy, "Chargement de CommuniConseil...");
export const LazyCommuniConseilAdminDashboard = withSuspense(CommuniConseilAdminDashboardLazy, "Chargement du tableau de bord CommuniConseil...");
export const LazyProfilePage = withSuspense(ProfilePageLazy, "Chargement du profil...");
export const LazyModerationPage = withSuspense(ModerationPageLazy, "Chargement de la modération...");
export const LazyAdminDashboard = withSuspense(AdminDashboardLazy, "Chargement du dashboard administrateur...");
