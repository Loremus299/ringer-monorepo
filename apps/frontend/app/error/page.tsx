import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{
		status: string;
		error: string;
		goto: string;
		buttonName: string;
		id?: string;
	}>;
}) {
	const sp = await searchParams;

	return (
		<div className="w-screen h-screen p-4 grid place-items-center">
			<main className="grid gap-2 place-items-center max-w-sm w-full">
				<h1 className="text-8xl font-mono">{sp.status}</h1>
				<h2 className="text-center">{sp.error}</h2>
				<p className="text-center">{sp.id}</p>
				<Link href={sp.goto} className="w-sm">
					<Button className={"w-sm text-background"}>
						<ExternalLink className="size-3 stroke-3" />
						{sp.buttonName}
					</Button>
				</Link>
			</main>
		</div>
	);
}
