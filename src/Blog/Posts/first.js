const myFirstPost = `
# Test Post: MathJax and Code Formatting

**THIS is a TEST POST FOR CHECKING MATHJAX AND CODE FORMATTING IN BLOG POSTS**

Here's inline math: $E = mc^2$

Block equation:

$$
\\frac{\\partial f}{\\partial x}
= \\lim_{h \\to 0}
\\frac{f(x+h) - f(x)}{h}
$$

$$
\\int_a^b f(x) \\, dx = F(b) - F(a)
$$

## Likelihood and KL Divergence

We consider an i.i.d. model with likelihood

$$
L(\\theta) = \\prod_{i=1}^{n} P(x_i \\mid \\theta),
$$

which corresponds to the joint distribution

$$
p_\\theta(x_{1:n}) = \\prod_{i=1}^n p_\\theta(x_i).
$$

Let the true data-generating distribution be $p_0(x)$, so that

$$
p_0(x_{1:n}) = \\prod_{i=1}^n p_0(x_i).
$$

---

### KL divergence for the joint distribution

The KL divergence between the true joint distribution and the model joint distribution is

$$
\\mathrm{KL}\\bigl(p_0(x_{1:n}) \\;\\|\\; p_\\theta(x_{1:n})\\bigr)
=
\\int p_0(x_{1:n})
\\log \\frac{p_0(x_{1:n})}{p_\\theta(x_{1:n})}
\\, dx_{1:n}.
$$

Using the product structure,

$$
\\log \\frac{p_0(x_{1:n})}{p_\\theta(x_{1:n})}
=
\\sum_{i=1}^n
\\log \\frac{p_0(x_i)}{p_\\theta(x_i)}.
$$

Substituting this back and exchanging the sum and integral,

$$
\\mathrm{KL}(p_0^{\\otimes n} \\| p_\\theta^{\\otimes n})
=
\\sum_{i=1}^n
\\int p_0(x_i)
\\log \\frac{p_0(x_i)}{p_\\theta(x_i)}
\\, dx_i.
$$

Therefore,

$$
\\boxed{
\\mathrm{KL}\\bigl(p_0(x_{1:n}) \\| p_\\theta(x_{1:n})\\bigr)
=
n\\,\\mathrm{KL}(p_0 \\| p_\\theta)
}
$$

---

### Connection to maximum likelihood

Taking logs of the likelihood,

$$
\\log L(\\theta) = \\sum_{i=1}^n \\log p_\\theta(x_i).
$$

Taking expectation under $p_0$,

$$
\\mathbb{E}_{p_0}[\\log L(\\theta)]
=
n\\,\\mathbb{E}_{p_0}[\\log p_\\theta(X)].
$$

Using the identity

$$
\\mathrm{KL}(p_0 \\| p_\\theta)
=
\\mathbb{E}_{p_0}[\\log p_0(X)]
-
\\mathbb{E}_{p_0}[\\log p_\\theta(X)],
$$

we obtain

$$
\\mathbb{E}_{p_0}[\\log L(\\theta)]
=
n\\,\\mathbb{E}_{p_0}[\\log p_0(X)]
-
n\\,\\mathrm{KL}(p_0 \\| p_\\theta).
$$

Since the first term does not depend on $\\theta$, maximizing expected log-likelihood is equivalent to minimizing KL divergence:

$$
\\boxed{
\\arg\\max_\\theta\\, \\mathbb{E}_{p_0}[\\log L(\\theta)]
=
\\arg\\min_\\theta\\, \\mathrm{KL}(p_0 \\| p_\\theta)
}
$$

## Code Example

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

\`\`\`cpp
#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`
`;

export default myFirstPost;
