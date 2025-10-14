import { Drawer, Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Menu } from "@mui/icons-material";
import SidebarMenu from "./SidebarMenu";

// Define the props type
interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  darkmode: boolean;
  setDarkMode: (darkMode: boolean) => void;

}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen,darkmode,setDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1301,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        >
          <Menu />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? 240 : 100,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 70,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            position: "fixed",
            height: "100vh",
            zIndex: 1100,
            backgroundColor: darkmode ? "#ddd" : "#fff",

          },
        }}
      >
        <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
          {open && <Typography variant="h6">HMS</Typography>}
          <IconButton onClick={() => setOpen(!open)}>
            <Menu />
          </IconButton>
        </Box>
        <SidebarMenu open={open} />
      </Drawer>
    </>
  );
};

export default Sidebar;
