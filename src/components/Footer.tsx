import { Heart, GithubLogo } from '@phosphor-icons/react';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background/80 backdrop-blur-md mt-20 py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

                {/* Left Column: Identity */}
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">CineMatch</span>
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">v1.0</span>
                    </div>
                    <span className="text-xs text-muted-foreground">© 2025 TheYruey</span>
                </div>

                {/* Center Column: Signature */}
                <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                    <span>Desarrollado con</span>
                    <Heart weight="fill" size={18} className="text-red-500 animate-pulse" />
                    <span>por</span>
                    <a
                        href="https://github.com/TheYruey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-primary transition-colors hover:underline decoration-wavy decoration-primary underline-offset-4"
                    >
                        TheYruey
                    </a>
                </div>

                {/* Right Column: Credits & Social */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        Powered by TMDB
                    </a>
                    <a
                        href="https://github.com/TheYruey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-[#2dba4e] hover:scale-125 transition-all duration-300"
                        aria-label="GitHub Profile"
                    >
                        <GithubLogo size={26} />
                    </a>
                </div>

            </div>
        </footer>
    );
}
