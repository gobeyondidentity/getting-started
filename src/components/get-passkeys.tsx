import "bootstrap/dist/css/bootstrap.css";
import { Passkey } from '@beyondidentity/bi-sdk-js';
import { Component } from "react";

class GetPasskeys extends Component<{}, { passkeys: Passkey[] }> {
  constructor(props: any) {
    super(props);
    this.state = { passkeys: [] };
  }

  async componentDidMount() {
    const BeyondIdentityEmbeddedSdk = await import("../utils/BeyondIdentityEmbeddedSdk");
    let embedded = new BeyondIdentityEmbeddedSdk.default();
    this.setState({ passkeys: await embedded.getPasskeys() });
    window.addEventListener("message", async (event) => {
      if (event.data === "update-passkeys") {
        this.setState({ passkeys: await embedded.getPasskeys() });
      } else {
        console.log("Unknown event data received:", event.data);
      }
    });
  }

  async handleDeletePasskeyClick(e: React.MouseEvent<HTMLButtonElement>, passkey: Passkey) {
    e.preventDefault();
    const BeyondIdentityEmbeddedSdk = await import("../utils/BeyondIdentityEmbeddedSdk");
    let embedded = new BeyondIdentityEmbeddedSdk.default();
    let result = window.confirm(`Are you sure you want to delete passkey with username \"${passkey.identity.username}\"?`);
    if (result) {
      await embedded.deletePasskey(passkey.id);
      this.setState({ passkeys: await embedded.getPasskeys() });
    }
  }

  render() {
    return (
      <main className="flex-shrink-0 mb-5">
        <section className="py-1 container">
          <div className="row py-3">
            <div className="col-lg-12 mx-auto">
              <br></br>
              <h3 className="fw-light">Local Passkeys</h3>
              <br></br>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Logo</th>
                      <th scope="col">Username</th>
                      <th scope="col">Display Name</th>
                      <th scope="col">ID</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.passkeys.map(passkey => (
                      <tr key={passkey.id}>
                        <td><button
                          type="button"
                          value={passkey.id}
                          onClick={event => this.handleDeletePasskeyClick(event, passkey)}
                          className="btn btn-primary btn-md"
                        >Delete</button></td>
                        <th scope="row"><img src={passkey.theme.logoUrlLight} style={{ width: "50px" }} alt="Beyond Identity Passkey Logo"></img></th>
                        <td>{passkey.identity.username}</td>
                        <td>{passkey.identity.displayName}</td>
                        <td>{passkey.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default GetPasskeys;