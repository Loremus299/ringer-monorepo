import UIContainer from "@/components/uiContainer";
import Image from "next/image";
import LoginForm from "./client.page";

export default function Page() {
	return (
		<UIContainer>
			<div className="w-full h-full grid grid-cols-2">
				<div className="border-r"></div>
				<div className="grid place-items-center">
					<main className="grid gap-5">
						<div className="flex items-center gap-3">
							<Image
								src={"/logo.svg"}
								alt="Logo"
								width={500}
								height={500}
								className="size-6"
							/>
							<h1 className="text-xl tracking-tight font-semibold">Ringer</h1>
						</div>
						<LoginForm />
					</main>
				</div>
			</div>
		</UIContainer>
	);
}
