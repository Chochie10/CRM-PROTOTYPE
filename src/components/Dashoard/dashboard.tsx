import { useAuth } from "../../auth/authContext";
import SalespersonDashboard from "./salesperson";
import ManagerDashboard from "./manager";
import ExecomDashboard from "./execom";
import AdminDashboard from "./admin";

const DashboardContainer = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case "SALESPERSON":
      return <SalespersonDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "EXECOM":
      return <ExecomDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    default:
      return <div>Unauthorized access</div>;
  }
};

export default DashboardContainer;