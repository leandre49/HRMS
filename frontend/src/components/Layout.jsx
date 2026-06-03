import Sidebar from './Sidebar';
import Notification from './Notification';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
      <Notification />
    </div>
  );
}
