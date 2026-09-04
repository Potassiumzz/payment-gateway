using Ntay.Security;
using Xunit;

namespace Ntay.Tests.Security;

public class PinHasherTests
{
    [Fact]
    public void Verify_WithCorrectPin_ReturnsTrue()
    {
        string hashedPin = PinHasher.HashPin("1100");

        bool result = PinHasher.VerifyPin("1100", hashedPin);

        Assert.True(result);
    }

    [Fact]
    public void Verify_WithWrongPin_ReturnsFalse()
    {
        string hashedPin = PinHasher.HashPin("1100");

        bool result = PinHasher.VerifyPin("1234", hashedPin);

        Assert.False(result);
    }
}
