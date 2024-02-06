import styles from "./MenuEvents.module.scss";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MenuEvents() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        className={styles["button-events"]}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Noël 2024 à Clarat
      </Button>
      <Menu
        id="basic-menu"
        className={`${styles["menu-open-events"]} ${isAdminPage ? styles["menu-open-events-admin"] : ""}`}
        anchorEl={anchorEl}
        disableScrollLock={true}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Noël 2024 à Lespi</MenuItem>
        <MenuItem onClick={handleClose}>Noël 2024 à Coutras</MenuItem>
      </Menu>
    </>
  );
}
