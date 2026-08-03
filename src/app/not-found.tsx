import { MagneticButton } from "@/components/common/magnetic-button"
import { MaskedTitle } from "@/components/common/masked-title"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="font-display text-[clamp(6rem,4rem+10vw,14rem)] leading-none font-light text-primary/20">
        404
      </span>
      <MaskedTitle
        as="h1"
        immediate
        className="-mt-6 max-w-xl font-display text-[clamp(2rem,1.6rem+2vw,3.5rem)] leading-[1.05] font-light text-balance"
      >
        This table hasn&apos;t been set.
      </MaskedTitle>
      <p className="mt-6 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for was moved, renamed, or possibly eaten
        before service. Let&apos;s get you back to the dining room.
      </p>
      <div className="mt-10">
        <MagneticButton href="/">Back to Home</MagneticButton>
      </div>
    </div>
  )
}
