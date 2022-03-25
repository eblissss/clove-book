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
import React, { useEffect, useState } from "react";
import { TabBar } from "../../components/tabBar/TabBar";
import { deleteUser, getUser, updateUser } from "../../api/requests";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, setUser } from "./userSlice";
import { User } from "../../api/models";
import md5 from "md5";
import { useNavigate } from "react-router-dom";

const titles = ["First Name", "Last Name", "Username", "Email"];

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
					defaultValue={info}
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
	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const [editing, setEditing] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

	useEffect(() => {
		const setUserInfo = async (userID: string) => {
			const userInfo = await getUser(userID);
			dispatch(setUser(userInfo));
		};
		console.log("Getting info for: ", user.userID);
		setUserInfo(user.userID);
	}, []);

	const edit = () => {
		setEditing(true);
	};

	const confirmEdit = () => {
		const firstName = (
			document.getElementById(titles[0]) as HTMLInputElement
		).value;
		const lastName = (
			document.getElementById(titles[1]) as HTMLInputElement
		).value;
		const username = (
			document.getElementById(titles[0]) as HTMLInputElement
		).value;
		const email = (document.getElementById(titles[0]) as HTMLInputElement)
			.value;
		const time = new Date().toUTCString();

		const newUser: User = {
			...user,
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			updatedAt: time,
		};
		dispatch(setUser(newUser));

		// API call
		updateUser(user.userID, newUser);

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

	const resetPassword = () => {
		const passA = md5(
			(document.getElementById("oldPasswordA") as HTMLInputElement).value
		);
		const passB = md5(
			(document.getElementById("oldPasswordB") as HTMLInputElement).value
		);

		if (passA !== passB || passA !== user.password) {
			setEditing(false);
			return;
		}

		const password = md5(
			(document.getElementById("newPassword") as HTMLInputElement).value
		);
		const time = new Date().toUTCString();

		const newUser: User = { ...user, password: password, updatedAt: time };
		dispatch(setUser(newUser));

		// API call
		updateUser(user.userID, newUser);

		setEditing(false);
	};

	const deleteAccount = () => {
		const username = (
			document.getElementById("usernameConfirm") as HTMLInputElement
		).value;

		deleteUser(user.userID);
		navigate("/");
	};

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
										onClick={confirmEdit}
									/>
								}
								sx={{ pl: "2rem" }}
								direction="right"
							>
								<SpeedDialAction
									icon={<CloseIcon />}
									tooltipTitle={"Discard"}
									sx={{
										bgcolor: "primary.main",
									}}
									onClick={cancelEdit}
									open={true}
								/>
							</SpeedDial>
						) : (
							<SpeedDial
								ariaLabel="editDial"
								icon={
									<SpeedDialIcon
										icon={<MenuIcon />}
										openIcon={<EditIcon />}
										onClick={edit}
									/>
								}
								sx={{ pl: "2rem" }}
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
							title={titles[0]}
							info={user.firstName}
							edit={editing}
						/>
						<InfoBlob
							title={titles[1]}
							info={user.lastName}
							edit={editing}
						/>
						<InfoBlob
							title={titles[2]}
							info={user.username}
							edit={editing}
						/>
						<InfoBlob
							title={titles[3]}
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
						id="usernameConfirm"
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
