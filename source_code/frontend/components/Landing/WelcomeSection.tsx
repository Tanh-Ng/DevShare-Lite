export default function WelcomeSection() {
  return (
    <div className="flex flex-col justify-center items-center p-10 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-6xl font-bold font-heading mb-4 gradient-text">
            Welcome to DevShare
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Share your knowledge, discover amazing content, and connect with the developer community.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Write & Share</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Discover Content</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Connect & Learn</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Write</h3>
            <p className="text-sm text-muted-foreground">Share your knowledge and experiences with the community</p>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Discover</h3>
            <p className="text-sm text-muted-foreground">Find amazing content from developers around the world</p>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Connect</h3>
            <p className="text-sm text-muted-foreground">Build relationships and learn from other developers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
