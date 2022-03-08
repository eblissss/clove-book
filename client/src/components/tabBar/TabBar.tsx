import React from "react";
import { Link } from "react-router-dom";

import styles from "./TabBar.module.css";
import { ReactComponent as TabSvg } from "./tab.svg";

interface tabProps {
	tab: string;
}

export function TabBar(props: tabProps) {
	return (
		<div className={styles.header}>
			<Link to="/home" className={styles.tabLink}>
				<button
					className={
						styles.tab +
						" " +
						(props.tab === "home" ? "" : styles.opacity)
					}
				>
					<span className={styles.tabText}>HOME</span>

					<TabSvg className={styles.tabSvg} />
				</button>
			</Link>
			<Link to="/saved" className={styles.tabLink}>
				<button
					className={
						styles.tab +
						" " +
						(props.tab === "saved" ? "" : styles.opacity)
					}
				>
					<span className={styles.tabText}>SAVED</span>
					<TabSvg className={styles.tabSvg} />
				</button>
			</Link>
			<Link to="/plan" className={styles.tabLink}>
				<button
					className={
						styles.tab +
						" " +
						(props.tab === "plan" ? "" : styles.opacity)
					}
				>
					<span className={styles.tabText}>PLAN</span>
					<TabSvg className={styles.tabSvg} />
				</button>
			</Link>
			<Link to="/create" className={styles.tabLink}>
				<button
					className={
						styles.tab +
						" " +
						(props.tab === "create" ? "" : styles.opacity)
					}
				>
					<span className={styles.tabText}>CREATE</span>
					<TabSvg className={styles.tabSvg} />
				</button>
			</Link>
			<Link to="/" className={styles.tabLink}>
				<button className={styles.logout}>Logout</button>
			</Link>
		</div>
	);
}
