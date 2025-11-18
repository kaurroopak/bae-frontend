
// import React, { useState } from 'react';

// export default function LoginForm({ onSubmit }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [remember, setRemember] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (onSubmit) onSubmit({ email, password, remember });
//   }

//   return (
//     <form className="form" onSubmit={handleSubmit}>
//       <label className="field">
//         <span className="label-text">Email</span>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           className="input"
//           required
//         />
//       </label>

//       <label className="field">
//         <span className="label-text">Password</span>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Enter your password"
//           className="input"
//           required
//         />
//       </label>

//       <div className="row between">
//         <label className="remember">
//           <input
//             type="checkbox"
//             checked={remember}
//             onChange={(e) => setRemember(e.target.checked)}
//           />
//           <span>Remember me</span>
//         </label>
//         <a className="link" href="#">Forgot password?</a>
//       </div>

//       <button type="submit" className="btn">Sign In</button>

//       <p className="signup">Don't have an account? <a href="#" className="link">Sign up</a></p>
//     </form>
//   );
// }


import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password, remember });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="label-text">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input"
          required
        />
      </label>

      <label className="field">
        <span className="label-text">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="input"
          required
        />
      </label>

      <div className="row between">
        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <a className="link" href="#">Forgot password?</a>
      </div>

      <button type="submit" className="btn">Sign In</button>

      <p className="signup">Don't have an account? <Link to="/signup" className="link">Sign up</Link></p>
    </form>
  );
}