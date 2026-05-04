import type React
    from "react";
import {
    Button
} from "@/components/ui/button";
import Google
    from "@/components/icons/google";
import Apple
    from "@/components/icons/apple";
import Facebook
    from "@/components/icons/facebook";

interface OAuthSessionProps {
    handleOauthLogin: (provider: string) => void;
}

export default function OAuthSession({handleOauthLogin}: OAuthSessionProps) {
    return (<div className="space-y-3">
        <div className="relative mb-6">
            <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-card-foreground/60 font-sans">Ou acesse com</span>
            </div>
        </div>

        <Button
            variant="outline"
            onClick={() => handleOauthLogin("Google")}
            className="w-full glass-effect border-white/30 hover-lift ripple-effect text-card-foreground hover:bg-white/20 font-sans transition-all duration-300"
        >
            <Google/>
            Continue com Google
        </Button>

        <Button
            variant="outline"
            onClick={() => handleOauthLogin("Apple")}
            className="w-full glass-effect border-white/30 hover-lift ripple-effect text-card-foreground hover:bg-white/20 font-sans transition-all duration-300"
        >
            <Apple/>
            Continue com Apple
        </Button>

        <Button
            variant="outline"
            onClick={() => handleOauthLogin("Meta")}
            className="w-full glass-effect border-white/30 hover-lift ripple-effect text-card-foreground hover:bg-white/20 font-sans transition-all duration-300"
        >
            <Facebook/>
            Continue com Meta
        </Button>
    </div>)
}
