using System.ComponentModel.DataAnnotations;

namespace Ntay.Dtos.Common;

public sealed class PinAttribute : ValidationAttribute
{
    private const int PinLength = 4;
    private static readonly System.Text.RegularExpressions.Regex NumericRegex = new(@"^\d{4}$");

    public PinAttribute()
        : base("Pin must be exactly 4 numeric digits.") { }

    public override bool IsValid(object? value)
    {
        if (value is not string pin)
            return false;

        return pin.Length == PinLength && NumericRegex.IsMatch(pin);
    }
}
