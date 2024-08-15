import { Plugin, PluginNameVersion, Server, Request, ResponseToolkit } from "@hapi/hapi";

export interface GoogleProfile {
    id: string;
    displayName: string;
    name: {
        given_name: string;
        family_name: string;
    };
    email: string;
    raw: any;
}

const root: Plugin<PluginNameVersion> = {
    name: 'tikuence/modules/auth',
    version: '1.0.0',
    register: function (server: Server) {
        console.log("Inside 'tikuence/modules/auth'");

        server.route([
            {
                method: "GET",
                path: "/login",
                options: {
                    auth: {
                        mode: 'try',
                        strategy: 'session'
                    }
                },
                handler(request, h) {
                    if (!request.auth.isAuthenticated) {
                        h.redirect("/");
                    }
                    return h.inertia("Auth/Login", {
                        name: "Sergio",
                        points: 1000
                    }, {
                        title: "Hey root!",
                        message: "Welcome!",
                        year: 2021
                    });
                }
            },
            {
                method: "GET",
                path: "/register",
                options: {
                    auth: {
                        mode: 'try',
                        strategy: 'session'
                    }
                },
                handler(request, h) {
                    if (!request.auth.isAuthenticated) {
                        h.redirect("/");
                    }
                    return h.inertia("Auth/Register", {
                        name: "Sergio",
                        points: 1000
                    }, {
                        title: "Hey root!",
                        message: "Welcome!",
                        year: 2021
                    });
                }
            },
            {
                method: ["GET", "POST"],
                path: "/google",
                options: {
                    auth: {
                        mode: 'try',
                        strategy: 'google'
                    },
                    cors: {
                        credentials: true,
                        origin: ["*"],
                        headers: [
                            'WWW-Authenticate',
                            'Server-Authorization'
                        ]
                    }
                },
                handler(request: Request, h: ResponseToolkit) {
                    if (!request.auth.isAuthenticated) {
                        return `Authentication failed due to: ${request.auth.error.message}`;
                    }

                    const profile = request.auth.credentials.profile as GoogleProfile;

                    request.cookieAuth.set("profile", {
                        displayName: profile.displayName,
                        email: profile.email,
                    });

                    // Perform any account lookup or registration, setup local session,
                    // and redirect to the application. The third-party credentials are
                    // stored in request.auth.credentials. Any query parameters from
                    // the initial request are passed back via request.auth.credentials.query.

                    return h.redirect('/');
                }
            }
        ])
    }
};

export default root;
