import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	TextField,
	Typography,
} from "@mui/material";
import {
	Edit as EditIcon,
	DeleteForever as DeleteIcon,
	Menu as MenuIcon,
	Close as CloseIcon,
	Check as CheckIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { User } from "../../api/models";
import { TabBar } from "../../components/tabBar/TabBar";
import { getUser } from "../../api/requests";

const initialUser: User = {
	userID: 0,
	username: "Fire",
	firstName: "John",
	lastName: "Dover",
	email: "flame@gmail.com",
	createdAt: "00:00 idk format",
	updatedAt: "00:00 idk format",
	password: "passhash",
};

function InfoBlob({
	title,
	info,
	edit,
}: {
	title: string;
	info: string;
	edit: boolean;
}) {
	return (
		<Container
			sx={{ flex: "1 0 34%", width: "100px", display: "relative" }}
		>
			<Typography variant="h6" component="h6" fontWeight={700}>
				{title}:
			</Typography>
			{edit ? (
				<TextField
					margin="dense"
					id={title}
					label={title}
					variant="filled"
					value={info}
				/>
			) : (
				<Typography
					variant="body1"
					component="h5"
					sx={{
						p: "1px",
					}}
				>
					{info}
				</Typography>
			)}
		</Container>
	);
}

function UserPage() {
	const [user, setUser] = useState(initialUser);
	const [editing, setEditing] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

	const setUserInfo = async (user: string) => {
		const userInfo = await getUser(user);
		setUser(userInfo);
	};

	// setUserInfo("pocoyo");

	const edit = () => {
		setEditing(true);
	};

	const confirmEdit = () => {
		setEditing(false);
	};

	const cancelEdit = () => {
		setEditing(false);
	};

	const deleteDialog = () => {
		setDeleteDialogOpen(true);
	};

	const handleClose = () => {
		setDeleteDialogOpen(false);
		setPasswordDialogOpen(false);
	};

	const passwordDialog = () => {
		setPasswordDialogOpen(true);
	};

	const resetPassword = () => {};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<TabBar tab="user" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					minHeight: "calc(100vh - 59px)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "start",
				}}
			>
				<Container
					disableGutters
					sx={{
						display: "inline-flex",
						width: "auto",
						flexDirection: "column",
					}}
				>
					<Container
						sx={{
							display: "inline-flex",
							alignItems: "end",
						}}
					>
						<Typography component="h3" variant="h3">
							My Account
						</Typography>
						{editing ? (
							<SpeedDial
								ariaLabel="closeDial"
								icon={
									<SpeedDialIcon
										icon={<CheckIcon />}
										openIcon={<CheckIcon />}
									/>
								}
								sx={{ pl: "2rem" }}
								onClick={confirmEdit}
								direction="right"
							>
								<SpeedDialAction
									icon={<CloseIcon />}
									tooltipTitle={"Discard"}
									sx={{
										bgcolor: "primary.main",
									}}
									onClick={cancelEdit}
								/>
							</SpeedDial>
						) : (
							<SpeedDial
								ariaLabel="editDial"
								icon={
									<SpeedDialIcon
										icon={<MenuIcon />}
										openIcon={<EditIcon />}
									/>
								}
								sx={{ pl: "2rem" }}
								onClick={edit}
								direction="right"
							>
								<SpeedDialAction
									icon={<DeleteIcon />}
									tooltipTitle={"Delete"}
									sx={{
										bgcolor: "primary.main",
									}}
									onClick={deleteDialog}
								/>
							</SpeedDial>
						)}
					</Container>
					{/* ACCOUNT INFO */}
					<Box
						component="div"
						sx={{
							display: "inline-flex",
							flexWrap: "wrap",
							backgroundColor: "primary.main",
							p: "6px",
							m: "20px",
							borderRadius: "8px",
						}}
					>
						<InfoBlob
							title="First Name"
							info={user.firstName}
							edit={editing}
						/>
						<InfoBlob
							title="Last Name"
							info={user.lastName}
							edit={editing}
						/>
						<InfoBlob
							title="Username"
							info={user.username}
							edit={editing}
						/>
						<InfoBlob
							title="Email"
							info={user.email}
							edit={editing}
						/>
					</Box>
					<Button
						variant="outlined"
						sx={{
							m: "20px",
							backgroundColor: "primary.main",
							color: "primary.light",
							"&:hover": {
								color: "primary.dark",
							},
						}}
						onClick={passwordDialog}
					>
						Reset Password
					</Button>
				</Container>
			</Container>
			{/* DELETE DIALOG */}
			<Dialog open={deleteDialogOpen} onClose={handleClose}>
				<DialogTitle>Confirm Account Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To confirm deletion of your account, please enter your
						username.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="username"
						label="Username"
						type="username"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleClose}
						variant="outlined"
						color="error"
					>
						Confirm Deletion
					</Button>
				</DialogActions>
			</Dialog>
			{/* RESET PASSWORD DIALOG */}
			<Dialog open={passwordDialogOpen} onClose={handleClose}>
				<DialogTitle>Reset Password</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Input your old password and new password.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="oldPasswordA"
						label="Old Password"
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						id="oldPasswordB"
						label="Old Password Again"
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						id="newPassword"
						label="New Password"
						type="password"
						fullWidth
						variant="filled"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleClose}
						variant="outlined"
						color="secondary"
					>
						Change Password
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default UserPage;
