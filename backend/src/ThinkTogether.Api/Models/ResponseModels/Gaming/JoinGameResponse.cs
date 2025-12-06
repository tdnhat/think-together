﻿namespace ThinkTogether.Api.Models.ResponseModels.Gaming;

public record JoinGameResponse
{
    public Guid PlayerId { get; init; }
    public string Nickname { get; init; } = string.Empty;
    public string Pin { get; init; } = string.Empty;
}

