export default function UIContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-screen min-h-screen grid place-items-center">
			<div className="max-w-7xl w-full h-full border-l border-r">
				{children}
			</div>
		</div>
	);
}
