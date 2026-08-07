using Isopoh.Cryptography.Argon2;
using Isopoh.Cryptography.SecureArray;

namespace Ntay.Security;

public static class PinHasher
{
    // lightweight settings
    private const int TimeCost = 1; // number of iterations (default is usually 3)
    private const int MemoryCost = 1024; // KB = 1 MB (default is often 65536 KB = 64 MB)
    private const int Parallelism = 1; // threads/lanes (default is often higher)

    public static string HashPin(string pin)
    {
        var config = new Argon2Config
        {
            Type = Argon2Type.DataIndependentAddressing, // this is Argon2id
            TimeCost = TimeCost,
            MemoryCost = MemoryCost,
            Lanes = Parallelism,
            Threads = Parallelism,
            Password = System.Text.Encoding.UTF8.GetBytes(pin),
        };

        using var argon2 = new Argon2(config);
        using SecureArray<byte> hash = argon2.Hash();
        return config.EncodeString(hash.Buffer);
    }

    public static bool VerifyPin(string pin, string pinHash) =>
        Argon2.Verify(pinHash, pin, Parallelism);
}
